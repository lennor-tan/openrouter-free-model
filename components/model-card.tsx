import React from 'react';
import { useTranslations } from 'next-intl';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { SlidersHorizontal, FileText, Server, Brain } from 'lucide-react';
import { toast } from 'sonner';
import { Model } from '@/types';

interface ModelCardProps {
  model: Model;
  isSelected: boolean;
  onSelect: (modelId: string, checked: boolean) => void;
  onCompanyClick: (companyName: string) => void;
  isCompanySelected: boolean;
  onProviderClick: (providerName: string) => void;
  isProviderSelected: boolean;
}

export function ModelCard({
  model,
  isSelected,
  onSelect,
  onCompanyClick,
  isCompanySelected,
  onProviderClick,
  isProviderSelected,
}: ModelCardProps) {
  const t = useTranslations('ModelCard');

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success(t('copied', { text }));
  };

  // 格式化日期
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}/${month}/${day}`;
  };

  // 格式化上下文长度
  const formatContextLength = (length: number) => {
    if (length >= 1000000) {
      return `${(length / 1000000).toFixed(1)}M`;
    } else if (length >= 1000) {
      return `${(length / 1000).toFixed(1)}K`;
    }
    return length.toString();
  };

  return (
    <div className="border rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 bg-card">
      <div className="p-4">
        <div className="flex justify-between items-start">
          <div className="flex items-center space-x-2">
            <Checkbox
              checked={isSelected}
              onCheckedChange={(checked) =>
                onSelect(model.id, checked as boolean)
              }
            />
            <div>
              <h3 className="text-lg font-semibold flex items-center">
                {model.company_name ? (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Badge
                          variant={isCompanySelected ? 'default' : 'secondary'}
                          onClick={() => onCompanyClick(model.company_name)}
                          className="cursor-pointer mr-2 text-sm px-2 py-1"
                        >
                          {model.company_name}
                        </Badge>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{t('filterCompany', { companyName: model.company_name })}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ) : null}
                <span className="ml-1">{model.name}</span>
                {model.supports_reasoning && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <Brain className="ml-2 h-4 w-4 text-blue-500" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{t('supportsReasoning')}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </h3>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <p
                      className="text-sm text-muted-foreground cursor-pointer"
                      onClick={() => handleCopy(model.id + ':free')}
                    >
                      {model.id + ':free'}
                    </p>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{t('clickToCopy')}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-xs text-muted-foreground">
              {formatDate(model.updated_at)}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mt-3">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge
                  variant={isProviderSelected ? 'default' : 'secondary'}
                  onClick={() => onProviderClick(model.provider_display_name)}
                  className="cursor-pointer text-sm px-2 py-1.5"
                >
                  {model.icon_url ? (
                    <img
                      src={model.icon_url}
                      alt={model.provider_display_name}
                      className="mr-1 h-4 w-4 rounded-sm"
                    />
                  ) : (
                    <Server className="mr-1 h-4 w-4" />
                  )}
                  {model.provider_display_name}
                </Badge>
              </TooltipTrigger>
              <TooltipContent>
                <p>{t('filterProvider', { providerName: model.provider_display_name })}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <span className="inline-flex items-center px-2 py-1.5 rounded-md text-xs font-medium bg-secondary">
            <FileText className="mr-1 h-4 w-4" />
            {formatContextLength(model.context_length)}
          </span>
          {model.quantization && (
            <span className="inline-flex items-center px-2 py-1.5 rounded-md text-xs font-medium bg-secondary">
              <SlidersHorizontal className="mr-1 h-4 w-4" />
              {model.quantization}
            </span>
          )}
          {/* {model.group && (
            <span className="inline-flex items-center px-2.5 py-2.5 rounded-full text-xs font-medium bg-primary text-primary-foreground">
              {model.group}
            </span>
          )}
          <span className="inline-flex items-center px-2.5 py-2.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            {model.author}
          </span> */}
          {/* 输入/输出模态标签 */}
          <div className="flex flex-wrap items-center gap-1 px-1 py-1 bg-muted/50 rounded-md border border-muted">
            {/* 输入模态标签 */}
            <div className="flex flex-wrap gap-1">
              {model.input_modalities.map((modality) => (
                <span
                  key={`input-${modality}`}
                  className="inline-flex items-center px-1 py-0.5 rounded-sm text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200"
                >
                  {/* <span className="w-2 h-2 rounded-full bg-blue-500 mr-1"></span> */}
                  {modality}
                </span>
              ))}
            </div>

            <span className="text-muted-foreground text-sm">→</span>

            {/* 输出模态标签 */}
            <div className="flex flex-wrap gap-1">
              {model.output_modalities.map((modality) => (
                <span
                  key={`output-${modality}`}
                  className="inline-flex items-center px-1 py-0.5 rounded-sm text-xs font-medium bg-green-50 text-green-700 border border-green-200"
                >
                  {/* <span className="w-2 h-2 rounded-full bg-green-500 mr-1"></span> */}
                  {modality}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
