"use client";

import React, { useMemo } from 'react';
import useSWR from 'swr';
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal, Copy, RefreshCw, CheckSquare, XSquare, FlipHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  TooltipProvider,
} from "@/components/ui/tooltip";
import { ModelCard } from "@/components/model-card";
import { FilterSortPanel } from "@/components/filter-sort-panel";
import { CopyModal } from "@/components/copy-modal";
import { ModelsResponse, FilterSortState } from '@/types';
import { useModelFilter } from '@/hooks/use-model-filter';

// 数据获取函数，供 SWR 使用
const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function Home() {
  const { data, error, isLoading, mutate } = useSWR<ModelsResponse>('/api/models', fetcher);

  const {
    filterSortState,
    setFilterSortState,
    selectedModelIds,
    setSelectedModelIds,
    toggleModelSelection,
    clearSelection,
    filteredAndSortedModels,
    companyList,
    providerList,
  } = useModelFilter(data?.models || []);

  // 手动刷新数据
  const handleRefresh = () => {
    mutate();
    clearSelection();
  };
  
  // 检查是否有选中的模型
  const hasSelectedModels = selectedModelIds.size > 0;
  const selectedModels = useMemo(() => {
    return data?.models.filter(model => selectedModelIds.has(model.id)) || [];
  }, [selectedModelIds, data?.models]);

  // 判断当前是否已全选
  const isAllSelected = useMemo(() => {
    const filteredCount = filteredAndSortedModels.length;
    return filteredCount > 0 && selectedModelIds.size === filteredCount && filteredCount === [...selectedModelIds].filter(id => filteredAndSortedModels.some(m => m.id === id)).length;
  }, [selectedModelIds, filteredAndSortedModels]);

  // 更新筛选/排序状态的回调函数
  const updateFilterSortState = (newState: Partial<FilterSortState>) => {
    setFilterSortState(prev => ({ ...prev, ...newState }));
  };
  
  // 处理切换全选
  const handleToggleSelectAll = () => {
    const filteredModelIds = filteredAndSortedModels.map(model => model.id);
    if (isAllSelected) {
      // 当前已全选，则取消全选
      const newSelectedIds = new Set(selectedModelIds);
      filteredModelIds.forEach(id => newSelectedIds.delete(id));
      setSelectedModelIds(newSelectedIds);
    } else {
      // 当前未全选，则全选所有筛选出的模型
      const newSelectedIds = new Set(selectedModelIds);
      filteredModelIds.forEach(id => newSelectedIds.add(id));
      setSelectedModelIds(newSelectedIds);
    }
  };

  // 处理反选
  const handleInvertSelection = () => {
    const filteredModelIds = filteredAndSortedModels.map(model => model.id);
    filteredModelIds.forEach(toggleModelSelection);
  };
  
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
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 md:py-10">
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
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 md:py-10">
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
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 md:py-10">
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
                onSelect={(modelId, checked) => toggleModelSelection(modelId)}
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
