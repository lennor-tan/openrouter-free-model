import { useState, useMemo, useEffect, useCallback } from 'react';
import { Model, FilterSortState, Company, Provider } from '@/types';
import { sortModels } from '@/lib/utils';

export function useModelFilter(models: Model[]) {
  const [filterSortState, setFilterSortState] = useState<FilterSortState>({
    searchTerm: '',
    sortBy: 'updated_at:desc',
    showReasoningOnly: false,
    selectedCompanies: [],
    selectedProviders: [],
  });
  // Debounced search term
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(filterSortState.searchTerm);

  const [selectedModelIds, setSelectedModelIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(filterSortState.searchTerm);
    }, 300); // 300ms delay

    return () => {
      clearTimeout(handler);
    };
  }, [filterSortState.searchTerm]);

  const filteredAndSortedModels = useMemo(() => {
    const {
      sortBy,
      showReasoningOnly,
      selectedCompanies,
      selectedProviders,
    } = filterSortState;

    const companySet = new Set(selectedCompanies);
    const providerSet = new Set(selectedProviders);
    const lowercasedFilter = debouncedSearchTerm.toLowerCase();

    const filtered = models.filter(model => {
      // Reasoning filter
      if (showReasoningOnly && !model.supports_reasoning) {
        return false;
      }
      // Company filter
      if (companySet.size > 0 && !companySet.has(model.company_name)) {
        return false;
      }
      // Provider filter
      if (providerSet.size > 0 && !providerSet.has(model.provider_name)) {
        return false;
      }
      // Search term filter
      if (debouncedSearchTerm) {
        if (
          !model.name.toLowerCase().includes(lowercasedFilter) &&
          !model.company_name.toLowerCase().includes(lowercasedFilter) &&
          !model.provider_display_name
            .toLowerCase()
            .includes(lowercasedFilter) &&
          !model.description.toLowerCase().includes(lowercasedFilter)
        ) {
          return false;
        }
      }

      return true;
    });

    return sortModels(filtered, sortBy);
  }, [models, filterSortState.sortBy, filterSortState.showReasoningOnly, filterSortState.selectedCompanies, filterSortState.selectedProviders, debouncedSearchTerm]);

  const { companyList, providerList } = useMemo(() => {
    const companyCounts: Record<string, number> = {};
    const providerCounts: Record<string, number> = {};

    models.forEach(model => {
      if (model.company_name) {
        companyCounts[model.company_name] = (companyCounts[model.company_name] || 0) + 1;
      }
      if (model.provider_name) {
        providerCounts[model.provider_name] = (providerCounts[model.provider_name] || 0) + 1;
      }
    });

    const companies = Object.entries(companyCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
    
    const providers = Object.entries(providerCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));

    return { companyList: companies, providerList: providers };
  }, [models]);

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
  
  const clearSelection = useCallback(() => {
    setSelectedModelIds(new Set());
  }, []);

  const resetAllFilters = useCallback(() => {
    setFilterSortState({
      searchTerm: '',
      sortBy: 'updated_at:desc',
      showReasoningOnly: false,
      selectedCompanies: [],
      selectedProviders: [],
    });
    clearSelection();
  }, [clearSelection]);

  return {
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
  };
}