import { NextRequest } from 'next/server';
import { ApiResponse } from '@/types';
import { transformModels } from '@/lib/utils';

/**
 * GET 请求处理函数
 * @param request Next.js 的请求对象
 * @returns 包含模型列表的 JSON 响应
 */
export async function GET(request: NextRequest) {
  // 设置缓存策略：每 12 小时 (43200 秒) 重新验证一次数据
  // 设置缓存策略：每 1 小时 (3600 秒) 重新验证一次数据
  const cacheControl = 'public, s-maxage=3600, stale-while-revalidate=86400';

  try {
    // 向 OpenRouter API 发起请求
    const response = await fetch(
      'https://openrouter.ai/api/frontend/models/find?max_price=0',
      {
        headers: {
          'Content-Type': 'application/json',
          // 如果未来需要 API Key，可以在这里添加
          // 'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        },
        // next: { revalidate: 43200 } // 也可以在这里设置，但使用 headers 更通用
      },
    );

    // 检查响应状态
    if (!response.ok) {
      console.error(`API request failed with status ${response.status}`);
      return new Response(
        JSON.stringify({ error: 'Failed to fetch models from OpenRouter API' }),
        {
          status: response.status,
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': cacheControl,
          },
        },
      );
    }

    // 解析 JSON 响应
    const data: ApiResponse = await response.json();

    // 提取模型列表并精简数据
    const models = transformModels(data.data.models);

    // 返回成功响应
    return new Response(
      JSON.stringify({ models, last_fetched: new Date().toISOString() }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': cacheControl,
        },
      },
    );
  } catch (error) {
    // 处理网络错误或其他异常
    console.error('Error fetching models:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': cacheControl,
      },
    });
  }
}
