import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { X, Check, CircleX } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Company, Provider } from '@/types';

interface FilterSortPanelProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
  showReasoningOnly: boolean;
  onShowReasoningChange: (checked: boolean) => void;
  selectedCompanies: string[];
  onCompanyChange: (company: string, isSelectAll?: boolean) => void;
  companyList: Company[];
  selectedProviders: string[];
  onProviderChange: (provider: string, isSelectAll?: boolean) => void;
  providerList: Provider[];
  onClearAllFilters: () => void;
}

export function FilterSortPanel({
  searchTerm,
  onSearchChange,
  sortBy,
  onSortChange,
  showReasoningOnly,
  onShowReasoningChange,
  selectedCompanies,
  onCompanyChange,
  companyList,
  selectedProviders,
  onProviderChange,
  providerList,
  onClearAllFilters,
}: FilterSortPanelProps) {
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);

  useEffect(() => {
    const handler = setTimeout(() => {
      onSearchChange(localSearchTerm);
    }, 300); // 300ms debounce delay

    return () => {
      clearTimeout(handler);
    };
  }, [localSearchTerm, onSearchChange]);

  useEffect(() => {
    setLocalSearchTerm(searchTerm);
  }, [searchTerm]);

  const handleClearSearch = () => {
    setLocalSearchTerm('');
    onSearchChange('');
  };

  return (
    <div>
      <div className="p-4 mb-2 bg-card border rounded-lg shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* 搜索框 */}
          <div className="relative">
            <Input
              placeholder="搜索模型..."
              value={localSearchTerm}
              onChange={(e) => setLocalSearchTerm(e.target.value)}
              className="pr-10"
            />
            {localSearchTerm && (
              <button
                onClick={handleClearSearch}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* 公司筛选 */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-start">
                <span>选择公司...</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="w-[--radix-popover-trigger-width] p-0"
              align="start"
            >
              <Command>
                <CommandInput placeholder="搜索公司..." />
                <CommandList>
                  <CommandEmpty>没有找到公司</CommandEmpty>
                  <CommandGroup>
                    <CommandItem onSelect={() => onCompanyChange('all', true)}>
                      <div
                        className={cn(
                          'mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary',
                          selectedCompanies.length === companyList.length
                            ? 'bg-primary text-primary-foreground'
                            : 'opacity-50 [&_svg]:invisible',
                        )}
                      >
                        <Check className={cn('h-4 w-4')} />
                      </div>
                      <span>全选</span>
                    </CommandItem>
                    {companyList.map((company) => {
                      const isSelected = selectedCompanies.includes(
                        company.name,
                      );
                      return (
                        <CommandItem
                          key={company.name}
                          onSelect={() => onCompanyChange(company.name)}
                        >
                          <div
                            className={cn(
                              'mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary',
                              isSelected
                                ? 'bg-primary text-primary-foreground'
                                : 'opacity-50 [&_svg]:invisible',
                            )}
                          >
                            <Check className={cn('h-4 w-4')} />
                          </div>
                          <span>
                            {company.name} ({company.count})
                          </span>
                        </CommandItem>
                      );
                    })}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>

          {/* 供应商筛选 */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-start">
                <span>选择供应商...</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="w-[--radix-popover-trigger-width] p-0"
              align="start"
            >
              <Command>
                <CommandInput placeholder="搜索供应商..." />
                <CommandList>
                  <CommandEmpty>没有找到供应商</CommandEmpty>
                  <CommandGroup>
                    <CommandItem onSelect={() => onProviderChange('all', true)}>
                      <div
                        className={cn(
                          'mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary',
                          selectedProviders.length === providerList.length
                            ? 'bg-primary text-primary-foreground'
                            : 'opacity-50 [&_svg]:invisible',
                        )}
                      >
                        <Check className={cn('h-4 w-4')} />
                      </div>
                      <span>全选</span>
                    </CommandItem>
                    {providerList.map((provider) => {
                      const isSelected = selectedProviders.includes(
                        provider.name,
                      );
                      return (
                        <CommandItem
                          key={provider.name}
                          onSelect={() => onProviderChange(provider.name)}
                        >
                          <div
                            className={cn(
                              'mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary',
                              isSelected
                                ? 'bg-primary text-primary-foreground'
                                : 'opacity-50 [&_svg]:invisible',
                            )}
                          >
                            <Check className={cn('h-4 w-4')} />
                          </div>
                          <span>
                            {provider.name} ({provider.count})
                          </span>
                        </CommandItem>
                      );
                    })}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>

          {/* 排序方式 */}
          <Select value={sortBy} onValueChange={onSortChange}>
            <SelectTrigger>
              <SelectValue placeholder="排序方式" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="updated_at:desc">最近更新</SelectItem>
              <SelectItem value="context_length:desc">
                上下文长度 (降序)
              </SelectItem>
              <SelectItem value="context_length:asc">
                上下文长度 (升序)
              </SelectItem>
              <SelectItem value="name:asc">名称 (A-Z)</SelectItem>
              <SelectItem value="name:desc">名称 (Z-A)</SelectItem>
            </SelectContent>
          </Select>

          {/* 其他筛选器可以放在这里 */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="reasoning-filter"
              checked={showReasoningOnly}
              onCheckedChange={(checked) => onShowReasoningChange(!!checked)}
            />
            <Label htmlFor="reasoning-filter">仅显示支持推理的模型</Label>
          </div>
        </div>
        {(selectedCompanies.length > 0 || selectedProviders.length > 0) && (
          <div className="mt-4 flex flex-wrap items-center gap-2">
            {selectedCompanies.map((company) => (
              <Badge
                key={company}
                variant="secondary"
                className="pl-2 text-sm px-3 py-1 bg-blue-100 dark:bg-blue-900"
              >
                {company}
                <button
                  onClick={() => onCompanyChange(company)}
                  className="ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
                >
                  <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                </button>
              </Badge>
            ))}
            {selectedProviders.map((provider) => (
              <Badge
                key={provider}
                variant="secondary"
                className="pl-2 text-sm px-3 py-1 bg-green-100 dark:bg-green-900"
              >
                {provider}
                <button
                  onClick={() => onProviderChange(provider)}
                  className="ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
                >
                  <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                </button>
              </Badge>
            ))}
            {(selectedCompanies.length > 0 || selectedProviders.length > 0) && (
              <Button
                variant="ghost"
                size="sm"
                className="text-sm text-muted-foreground hover:text-foreground"
                onClick={onClearAllFilters}
              >
                <CircleX className="h-4 w-4 mr-1 text-red-400" />
                全部清除
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
