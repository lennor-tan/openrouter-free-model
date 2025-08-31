'use client';

import React, { useMemo } from 'react';
import useSWR from 'swr';
import { useTranslations } from 'next-intl';
import { Skeleton } from '@/components/ui/skeleton';
import { ModelListSkeleton } from '@/components/model-view-skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  Terminal,
  Copy,
  RefreshCw,
  CheckSquare,
  XSquare,
  FlipHorizontal,
  Github,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TooltipProvider } from '@/components/ui/tooltip';
import { ModelCard } from '@/components/model-card';
import { FilterSortPanel } from '@/components/filter-sort-panel';
import { CopyModal } from '@/components/copy-modal';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { ModelsResponse, FilterSortState } from '@/types';
import { useModelFilter } from '@/hooks/use-model-filter';

// 数据获取函数，供 SWR 使用
const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function Home() {
  const t = useTranslations('HomePage');

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: t('faq1_q'),
        acceptedAnswer: {
          '@type': 'Answer',
          text: t('faq1_a'),
        },
      },
      {
        '@type': 'Question',
        name: t('faq2_q'),
        acceptedAnswer: {
          '@type': 'Answer',
          text: t('faq2_a'),
        },
      },
      {
        '@type': 'Question',
        name: t('faq3_q'),
        acceptedAnswer: {
          '@type': 'Answer',
          text: t('faq3_a'),
        },
      },
    ],
  };
  const { data, error, isLoading, isValidating, mutate } =
    useSWR<ModelsResponse>('/api/models', fetcher);

  const {
    filterSortState,
    setFilterSortState,
    selectedModelIds,
    setSelectedModelIds,
    toggleModelSelection,
    clearSelection,
    resetAllFilters,
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
    return data?.models.filter((model) => selectedModelIds.has(model.id)) || [];
  }, [selectedModelIds, data?.models]);

  // 判断当前是否已全选
  const isAllSelected = useMemo(() => {
    const filteredCount = filteredAndSortedModels.length;
    return (
      filteredCount > 0 &&
      selectedModelIds.size === filteredCount &&
      filteredCount ===
        [...selectedModelIds].filter((id) =>
          filteredAndSortedModels.some((m) => m.id === id),
        ).length
    );
  }, [selectedModelIds, filteredAndSortedModels]);

  // 更新筛选/排序状态的回调函数
  const updateFilterSortState = (newState: Partial<FilterSortState>) => {
    setFilterSortState((prev) => ({ ...prev, ...newState }));
  };

  // 处理切换全选
  const handleToggleSelectAll = () => {
    const filteredModelIds = filteredAndSortedModels.map((model) => model.id);
    if (isAllSelected) {
      // 当前已全选，则取消全选
      const newSelectedIds = new Set(selectedModelIds);
      filteredModelIds.forEach((id) => newSelectedIds.delete(id));
      setSelectedModelIds(newSelectedIds);
    } else {
      // 当前未全选，则全选所有筛选出的模型
      const newSelectedIds = new Set(selectedModelIds);
      filteredModelIds.forEach((id) => newSelectedIds.add(id));
      setSelectedModelIds(newSelectedIds);
    }
  };

  // 处理反选
  const handleInvertSelection = () => {
    const filteredModelIds = filteredAndSortedModels.map((model) => model.id);
    filteredModelIds.forEach(toggleModelSelection);
  };

  const handleCompanyChange = (
    companyName: string,
    isSelectAll: boolean = false,
  ) => {
    if (isSelectAll) {
      if (filterSortState.selectedCompanies.length === companyList.length) {
        updateFilterSortState({ selectedCompanies: [] });
      } else {
        updateFilterSortState({
          selectedCompanies: companyList.map((c) => c.name),
        });
      }
    } else {
      const newSelectedCompanies = filterSortState.selectedCompanies.includes(
        companyName,
      )
        ? filterSortState.selectedCompanies.filter((c) => c !== companyName)
        : [...filterSortState.selectedCompanies, companyName];
      updateFilterSortState({ selectedCompanies: newSelectedCompanies });
    }
  };

  const handleProviderChange = (
    providerName: string,
    isSelectAll: boolean = false,
  ) => {
    if (isSelectAll) {
      if (filterSortState.selectedProviders.length === providerList.length) {
        updateFilterSortState({ selectedProviders: [] });
      } else {
        updateFilterSortState({
          selectedProviders: providerList.map((p) => p.name),
        });
      }
    } else {
      const newSelectedProviders = filterSortState.selectedProviders.includes(
        providerName,
      )
        ? filterSortState.selectedProviders.filter((p) => p !== providerName)
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

  const renderContent = () => {
    if (error) {
      return (
        <Alert variant="destructive">
          <Terminal className="h-4 w-4" />
          <AlertTitle>{t('errorTitle')}</AlertTitle>
          <AlertDescription>
            {t('errorMessage', { message: error.message })}
          </AlertDescription>
        </Alert>
      );
    }

    if (isLoading) {
      return <ModelListSkeleton />;
    }

    if (filteredAndSortedModels && filteredAndSortedModels.length > 0) {
      return (
        <div className="space-y-4">
          {filteredAndSortedModels.map((model) => (
            <ModelCard
              key={model.id}
              model={model}
              isSelected={selectedModelIds.has(model.id)}
              onSelect={(modelId, checked) => toggleModelSelection(modelId)}
              onCompanyClick={handleCompanyChange}
              isCompanySelected={filterSortState.selectedCompanies.includes(
                model.company_name,
              )}
              onProviderClick={handleProviderChange}
              isProviderSelected={filterSortState.selectedProviders.includes(
                model.provider_display_name,
              )}
            />
          ))}
        </div>
      );
    }

    return (
      <div className="text-center py-10">
        <p className="text-muted-foreground">{t('noModelsFound')}</p>
      </div>
    );
  };

  return (
    <TooltipProvider>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 md:py-10">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
        <Header
          isLoading={isLoading}
          isValidating={isValidating}
          lastFetched={data?.last_fetched}
          resetAllFilters={resetAllFilters}
          handleRefresh={handleRefresh}
        />
        {/* 筛选/排序面板 */}
        <FilterSortPanel
          searchTerm={filterSortState.searchTerm}
          onSearchChange={(term) => updateFilterSortState({ searchTerm: term })}
          sortBy={filterSortState.sortBy}
          onSortChange={(sort) => updateFilterSortState({ sortBy: sort })}
          showReasoningOnly={filterSortState.showReasoningOnly}
          onShowReasoningChange={(checked) =>
            updateFilterSortState({ showReasoningOnly: checked })
          }
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
          <Button onClick={handleToggleSelectAll} variant="outline" size="sm">
            {isAllSelected ? (
              <XSquare className="mr-2 h-4 w-4" />
            ) : (
              <CheckSquare className="mr-2 h-4 w-4" />
            )}
            {isAllSelected ? t('deselectAll') : t('selectAll')}
          </Button>
          <Button onClick={handleInvertSelection} variant="outline" size="sm">
            <FlipHorizontal className="mr-2 h-4 w-4" />
            {t('invertSelection')}
          </Button>
          <div className="flex-grow"></div>
          <CopyModal selectedModels={selectedModels}>
            <Button disabled={!hasSelectedModels} variant="outline" size="sm">
              <Copy className="mr-2 h-4 w-4" />
              {t('copy')}[{selectedModelIds.size}/
              {filteredAndSortedModels.length || 0}]
            </Button>
          </CopyModal>
        </div>

        {/* 内容区域 */}
        <main role="main">
          {/* SEO优化的介绍性内容 (对用户视觉隐藏，但可被搜索引擎和屏幕阅读器访问) */}
          <section className="sr-only" aria-labelledby="introduction-title">
            <h2 id="introduction-title">{t('subheading')}</h2>
            <p>{t('introText')}</p>
          </section>

          {renderContent()}
        </main>
        <Footer />
      </div>
    </TooltipProvider>
  );
}
