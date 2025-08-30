"use client";

import React, { useState, useEffect } from 'react';
import useSWR from 'swr';
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton"; // For loading state
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"; // For error state
import { Terminal, Copy, RefreshCw, CheckSquare, XSquare, FlipHorizontal } from "lucide-react"; // Icon for error alert
import { Button } from "@/components/ui/button"; // For refresh and export buttons
import { toast } from "sonner"; // For toast notifications
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ModelCard } from "@/components/model-card"; // Model card component
import { FilterSortPanel } from "@/components/filter-sort-panel"; // Filter and sort panel component
import { CopyModal } from "@/components/copy-modal"; // 复制模态框组件
import { Model, ModelsResponse, FilterSortState, Company, Provider } from '@/types';

// 数据获取函数，供 SWR 使用
const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function Home() {
  // 使用 SWR 获取数据
  
  // 状态管理：已选中的模型 ID 列表
  const [selectedModelIds, setSelectedModelIds] = useState<Set<string>>(new Set());
  
  // 筛选和排序状态
  const [filterSortState, setFilterSortState] = useState<FilterSortState>({
    searchTerm: '',
    sortBy: 'updated_at-desc',
    showReasoningOnly: false,
    selectedCompanies: [],
    selectedProviders: [],
  });

  const { data, error, isLoading, mutate } = useSWR<ModelsResponse>('/api/models', fetcher);

  // 处理单个模型的选中/取消选中
  const handleModelSelect = (modelId: string, checked: boolean) => {
    const newSelected = new Set(selectedModelIds);
    if (checked) {
      newSelected.add(modelId);
    } else {
      newSelected.delete(modelId);
    }
    setSelectedModelIds(newSelected);
  };

  // 手动刷新数据
  const handleRefresh = () => {
    mutate(); // 调用 SWR 的 mutate 函数重新获取数据
  };

  // 检查是否有选中的模型（用于导出按钮的禁用状态）
  const hasSelectedModels = selectedModelIds.size > 0;
  const selectedModels = React.useMemo(() => {
    return data?.models.filter(model => selectedModelIds.has(model.id)) || [];
  }, [selectedModelIds, data?.models]);

  // 根据筛选和排序状态过滤和排序模型
  const filteredAndSortedModels = React.useMemo(() => {
    if (!data?.models) return [];

    let result = [...data.models];

    // 搜索筛选
    if (filterSortState.searchTerm) {
      const term = filterSortState.searchTerm.toLowerCase();
      result = result.filter(model =>
        model.company_name.toLowerCase().includes(term) ||
        model.name.toLowerCase().includes(term) ||
        model.description.toLowerCase().includes(term) ||
        model.provider_display_name.toLowerCase().includes(term)
      );
    }

    // 公司筛选
    if (filterSortState.selectedCompanies.length > 0) {
      result = result.filter(model => filterSortState.selectedCompanies.includes(model.company_name));
    }

    // 供应商筛选
    if (filterSortState.selectedProviders.length > 0) {
      result = result.filter(model => filterSortState.selectedProviders.includes(model.provider_display_name));
    }

    // “仅显示支持推理的模型” 筛选
    if (filterSortState.showReasoningOnly) {
      result = result.filter(model => model.supports_reasoning);
    }

    // 排序
    const [sortField, sortOrder] = filterSortState.sortBy.split('-');
    result.sort((a, b) => {
      let aValue: string | number | Date | null | string[] | boolean | undefined = a[sortField as keyof Model];
      let bValue: string | number | Date | null | string[] | boolean | undefined = b[sortField as keyof Model];
      
      // 特殊情况：排序上下文长度
      if (sortField === 'context_length') {
        aValue = a.context_length;
        bValue = b.context_length;
      }
      
      // 特殊情况：排序日期
      if (sortField === 'updated_at') {
        aValue = new Date(a.updated_at);
        bValue = new Date(b.updated_at);
      }
      
      // 对于字符串，先转为小写
      if (typeof aValue === 'string') aValue = aValue.toLowerCase();
      if (typeof bValue === 'string') bValue = bValue.toLowerCase();

      if (aValue === null || aValue === undefined) return 1;
      if (bValue === null || bValue === undefined) return -1;
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return result;
  }, [data?.models, filterSortState]);

  // 判断当前是否已全选
  const isAllSelected = React.useMemo(() => {
    const filteredCount = filteredAndSortedModels.length;
    return filteredCount > 0 && selectedModelIds.size === filteredCount;
  }, [selectedModelIds, filteredAndSortedModels]);

  // 处理切换全选
  const handleToggleSelectAll = () => {
    if (isAllSelected) {
      // 当前已全选，则取消全选
      setSelectedModelIds(new Set());
    } else {
      // 当前未全选，则全选所有筛选出的模型
      const filteredModelIds = new Set(filteredAndSortedModels.map(model => model.id));
      setSelectedModelIds(filteredModelIds);
    }
  };

  // 处理反选
  const handleInvertSelection = () => {
    const filteredModelIds = filteredAndSortedModels.map(model => model.id);
    const newSelected = new Set(selectedModelIds);
    filteredModelIds.forEach(id => {
      if (newSelected.has(id)) {
        newSelected.delete(id);
      } else {
        newSelected.add(id);
      }
    });
    setSelectedModelIds(newSelected);
  };

  // 更新筛选/排序状态的回调函数
  const updateFilterSortState = (newState: Partial<FilterSortState>) => {
    setFilterSortState(prev => ({ ...prev, ...newState }));
  };

  // 根据当前筛选（除公司外）生成动态公司列表
  const companyList = React.useMemo(() => {
    if (!data?.models) return [];
    
    let modelsToList = [...data.models];

    // 应用其他筛选器
    if (filterSortState.searchTerm) {
      const term = filterSortState.searchTerm.toLowerCase();
      modelsToList = modelsToList.filter(model =>
        model.company_name.toLowerCase().includes(term) ||
        model.name.toLowerCase().includes(term) ||
        model.description.toLowerCase().includes(term) ||
        model.provider_display_name.toLowerCase().includes(term)
      );
    }
    if (filterSortState.selectedProviders.length > 0) {
      modelsToList = modelsToList.filter(model => filterSortState.selectedProviders.includes(model.provider_display_name));
    }
    if (filterSortState.showReasoningOnly) {
      modelsToList = modelsToList.filter(model => model.supports_reasoning);
    }

    const counts: { [key: string]: number } = {};
    modelsToList.forEach(model => {
      counts[model.company_name] = (counts[model.company_name] || 0) + 1;
    });

    return Object.entries(counts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [data?.models, filterSortState.searchTerm, filterSortState.selectedProviders, filterSortState.showReasoningOnly]);

  const handleCompanyChange = (companyName: string, isSelectAll: boolean = false) => {
    if (isSelectAll) {
      if (filterSortState.selectedCompanies.length === companyList.length) {
        updateFilterSortState({ selectedCompanies: [] });
      } else {
        updateFilterSortState({ selectedCompanies: companyList.map(c => c.name) });
      }
    } else {
      const newSelectedCompanies = filterSortState.selectedCompanies.includes(companyName)
        ? filterSortState.selectedCompanies.filter(c => c !== companyName)
        : [...filterSortState.selectedCompanies, companyName];
      updateFilterSortState({ selectedCompanies: newSelectedCompanies });
    }
  };

  // 根据当前筛选（除供应商外）生成动态供应商列表
  const providerList = React.useMemo(() => {
    if (!data?.models) return [];
    
    let modelsToList = [...data.models];

    // 应用其他筛选器
    if (filterSortState.searchTerm) {
      const term = filterSortState.searchTerm.toLowerCase();
      modelsToList = modelsToList.filter(model =>
        model.company_name.toLowerCase().includes(term) ||
        model.name.toLowerCase().includes(term) ||
        model.description.toLowerCase().includes(term) ||
        model.provider_display_name.toLowerCase().includes(term)
      );
    }
    if (filterSortState.selectedCompanies.length > 0) {
      modelsToList = modelsToList.filter(model => filterSortState.selectedCompanies.includes(model.company_name));
    }
    if (filterSortState.showReasoningOnly) {
      modelsToList = modelsToList.filter(model => model.supports_reasoning);
    }

    const counts: { [key: string]: number } = {};
    modelsToList.forEach(model => {
      counts[model.provider_display_name] = (counts[model.provider_display_name] || 0) + 1;
    });

    return Object.entries(counts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [data?.models, filterSortState.searchTerm, filterSortState.selectedCompanies, filterSortState.showReasoningOnly]);

  const handleProviderChange = (providerName: string, isSelectAll: boolean = false) => {
    if (isSelectAll) {
      if (filterSortState.selectedProviders.length === providerList.length) {
        updateFilterSortState({ selectedProviders: [] });
      } else {
        updateFilterSortState({ selectedProviders: providerList.map(p => p.name) });
      }
    } else {
      const newSelectedProviders = filterSortState.selectedProviders.includes(providerName)
        ? filterSortState.selectedProviders.filter(p => p !== providerName)
        : [...filterSortState.selectedProviders, providerName];
      updateFilterSortState({ selectedProviders: newSelectedProviders });
    }
  };

  const handleClearAllFilters = () => {
    updateFilterSortState({
      selectedCompanies: [],
      selectedProviders: [],
    });
  };

  // 渲染加载状态
  if (isLoading) {
    return (
      <div className="container mx-auto py-10">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">OpenRouter <span className="whitespace-nowrap">Free Models</span></h1>
          <Button onClick={handleRefresh} disabled><RefreshCw className="mr-2 h-4 w-4" />刷新</Button>
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          {/* 可以添加更多 Skeleton 行来模拟表格 */}
        </div>
      </div>
    );
  }

  // 渲染错误状态
  if (error) {
    return (
      <div className="container mx-auto py-10">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">OpenRouter <span className="whitespace-nowrap">Free Models</span></h1>
          <Button onClick={handleRefresh}><RefreshCw className="mr-2 h-4 w-4" />刷新</Button>
        </div>
        <Alert variant="destructive">
          <Terminal className="h-4 w-4" />
          <AlertTitle>错误</AlertTitle>
          <AlertDescription>
            获取模型列表时发生错误: {error.message}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // 渲染数据
  return (
    <TooltipProvider>
      <div className="container mx-auto py-10">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">OpenRouter <span className="whitespace-nowrap">Free Models</span></h1>
            {data?.last_fetched && (
              <p className="text-xs text-muted-foreground mt-1">
                更新: {new Date(data.last_fetched).toLocaleString()}
              </p>
            )}
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-muted-foreground">
              已选择: {selectedModelIds.size} / {filteredAndSortedModels.length || 0}
            </span>
            <Button onClick={handleRefresh}><RefreshCw className="mr-2 h-4 w-4" />刷新</Button>
          </div>
        </div>
      
        {/* 筛选/排序面板 */}
        <FilterSortPanel
          searchTerm={filterSortState.searchTerm}
          onSearchChange={(term) => updateFilterSortState({ searchTerm: term })}
          sortBy={filterSortState.sortBy}
          onSortChange={(sort) => updateFilterSortState({ sortBy: sort })}
          showReasoningOnly={filterSortState.showReasoningOnly}
          onShowReasoningChange={(checked) => updateFilterSortState({ showReasoningOnly: checked })}
          selectedCompanies={filterSortState.selectedCompanies}
          onCompanyChange={handleCompanyChange}
          companyList={companyList}
          selectedProviders={filterSortState.selectedProviders}
          onProviderChange={handleProviderChange}
          providerList={providerList}
          onClearAllFilters={handleClearAllFilters}
        />

        {/* 导出按钮组和全选按钮 */}
        <div className="flex flex-wrap gap-2 mb-6 items-center">
          <Button
            onClick={handleToggleSelectAll}
            variant="outline"
            size="sm"
          >
            {isAllSelected ? <XSquare className="mr-2 h-4 w-4" /> : <CheckSquare className="mr-2 h-4 w-4" />}
            {isAllSelected ? '取消全选' : '全选'}
          </Button>
          <Button
            onClick={handleInvertSelection}
            variant="outline"
            size="sm"
          >
            <FlipHorizontal className="mr-2 h-4 w-4" />
            反选
          </Button>
          <div className="flex-grow"></div>
          <CopyModal selectedModels={selectedModels}>
            <Button
              disabled={!hasSelectedModels}
              variant="outline"
              size="sm"
            >
              <Copy className="mr-2 h-4 w-4" />
              复制
            </Button>
          </CopyModal>
        </div>

        {/* 模型卡片列表 */}
        {filteredAndSortedModels && filteredAndSortedModels.length > 0 ? (
          <div className="space-y-4">
            {filteredAndSortedModels.map((model) => (
              <ModelCard
                key={model.id}
                model={model}
                isSelected={selectedModelIds.has(model.id)}
                onSelect={handleModelSelect}
                onCompanyClick={handleCompanyChange}
                isCompanySelected={filterSortState.selectedCompanies.includes(model.company_name)}
                onProviderClick={handleProviderChange}
                isProviderSelected={filterSortState.selectedProviders.includes(model.provider_display_name)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-10">
            <p className="text-muted-foreground">没有找到模型数据</p>
          </div>
        )}
      </div>
    </TooltipProvider>
  );
}
