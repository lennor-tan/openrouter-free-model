import { useState, useMemo } from 'react';
import { Model, FilterSortState, Company, Provider } from '@/types';
import { sortModels, generateFilterList } from '@/lib/utils';

export function useModelFilter(models: Model[]) {
  const [filterSortState, setFilterSortState] = useState<FilterSortState>({
    searchTerm: '',
    sortBy: 'updated_at:desc',
    showReasoningOnly: false,
    selectedCompanies: [],
    selectedProviders: [],
  });

  const [selectedModelIds, setSelectedModelIds] = useState<Set<string>>(new Set());

  const filteredAndSortedModels = useMemo(() => {
    let filtered = models;

    if (filterSortState.showReasoningOnly) {
      filtered = filtered.filter(model => model.supports_reasoning);
    }

    if (filterSortState.selectedCompanies.length > 0) {
      filtered = filtered.filter(model => filterSortState.selectedCompanies.includes(model.company_name));
    }

    if (filterSortState.selectedProviders.length > 0) {
      filtered = filtered.filter(model => filterSortState.selectedProviders.includes(model.provider_name));
    }

    if (filterSortState.searchTerm) {
      const lowercasedFilter = filterSortState.searchTerm.toLowerCase();
      filtered = filtered.filter(
        model =>
          model.name.toLowerCase().includes(lowercasedFilter) ||
          model.company_name.toLowerCase().includes(lowercasedFilter) ||
          model.provider_display_name.toLowerCase().includes(lowercasedFilter) ||
          model.description.toLowerCase().includes(lowercasedFilter)
      );
    }
    
    return sortModels(filtered, filterSortState.sortBy);
  }, [models, filterSortState]);

  const companyList: Company[] = useMemo(() => generateFilterList(models, 'company_name'), [models]);
  const providerList: Provider[] = useMemo(() => generateFilterList(models, 'provider_name'), [models]);

  const toggleModelSelection = (modelId: string) => {
    setSelectedModelIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(modelId)) {
        newSet.delete(modelId);
      } else {
        newSet.add(modelId);
      }
      return newSet;
    });
  };
  
  const clearSelection = () => {
    setSelectedModelIds(new Set());
  };

  return {
    filterSortState,
    setFilterSortState,
    selectedModelIds,
    setSelectedModelIds,
    toggleModelSelection,
    clearSelection,
    filteredAndSortedModels,
    companyList,
    providerList,
  };
}