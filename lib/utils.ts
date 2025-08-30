import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { OpenRouterModel, Model } from '@/types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function transformModels(models: OpenRouterModel[]): Model[] {
  return models.map((model) => {
    const nameParts = model.name.split(':');
    const company_name =
      nameParts.length > 1 ? nameParts[0].trim() : (model.author || '').trim();
    const name =
      nameParts.length > 1
        ? nameParts.slice(1).join(':').trim()
        : model.name.trim();

    const icon_url = model.endpoint.provider_info.icon?.url || '';
    return {
      id: model.slug,
      permaslug: model.permaslug,
      hf_slug: model.hf_slug,
      company_name,
      name,
      short_name: model.short_name,
      author: model.author,
      description: model.description,
      updated_at: model.updated_at,
      context_length: model.context_length,
      input_modalities: model.input_modalities,
      output_modalities: model.output_modalities,
      group: model.group,
      endpoint_id: model.endpoint.id,
      endpoint_name: model.endpoint.name,
      provider_name: model.endpoint.provider_name,
      provider_display_name: model.endpoint.provider_display_name,
      provider_slug: model.endpoint.provider_slug,
      quantization: model.endpoint.quantization,
      supports_reasoning: model.endpoint.supports_reasoning,
      max_completion_tokens: model.endpoint.max_completion_tokens,
      icon_url: icon_url.startsWith('http')
        ? icon_url
        : `https://openrouter.ai${icon_url}`,
    };
  });
}

/**
 * 通用的排序工具函数
 * @param models 模型数组
 * @param sortBy 排序字段
 * @returns 排序后的模型数组
 */
export function sortModels(models: Model[], sortBy: string): Model[] {
  const [field, direction] = sortBy.split(':');
  const dir = direction === 'asc' ? 1 : -1;

  return [...models].sort((a, b) => {
    const aValue = a[field as keyof Model];
    const bValue = b[field as keyof Model];

    if (field === 'updated_at') {
      const dateA = new Date(aValue as string).getTime();
      const dateB = new Date(bValue as string).getTime();
      return (dateA - dateB) * dir;
    }

    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return aValue.localeCompare(bValue) * dir;
    }

    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return (aValue - bValue) * dir;
    }

    // 默认回退到 0
    return 0;
  });
}

/**
 * 生成筛选列表（如公司、供应商列表）
 * @param models 模型数组
 * @param groupByField 分组字段
 * @returns 包含名称和数量的列表
 */
export function generateFilterList(
  models: Model[],
  groupByField: 'company_name' | 'provider_name',
) {
  const counts = models.reduce(
    (acc, model) => {
      const key = model[groupByField];
      if (key) {
        acc[key] = (acc[key] || 0) + 1;
      }
      return acc;
    },
    {} as Record<string, number>,
  );

  return Object.entries(counts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
}
