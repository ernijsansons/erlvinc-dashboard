import { createOpenAICompatible } from '@ai-sdk/openai-compatible'
import OpenAI from 'openai'

/**
 * NVIDIA API Configuration
 *
 * This module provides centralized configuration for NVIDIA API integration
 * with Kimi 2.5 (primary) and DeepSeek (backup) models.
 */

export const NVIDIA_CONFIG = {
  baseURL: process.env.NVIDIA_BASE_URL || 'https://integrate.api.nvidia.com/v1',
  apiKey: process.env.NVIDIA_API_KEY!,
  models: {
    primary: process.env.PRIMARY_MODEL || 'moonshotai/kimi-k2.5',
    backup: process.env.BACKUP_MODEL || 'deepseek-ai/deepseek-v3.1',
  },
  params: {
    kimi: {
      thinking: { temperature: 1.0, top_p: 0.95 },  // For strategic discussions
      instant: { temperature: 0.6 },                // For quick factual queries
    },
  },
}

/**
 * Creates an NVIDIA provider for Vercel AI SDK
 *
 * Usage:
 * ```typescript
 * const nvidia = createNvidiaProvider()
 * const model = nvidia(NVIDIA_CONFIG.models.primary)
 * const result = await streamText({ model, ... })
 * ```
 */
export const createNvidiaProvider = () => {
  return createOpenAICompatible({
    name: 'nvidia',
    baseURL: NVIDIA_CONFIG.baseURL,
    headers: {
      'Authorization': `Bearer ${NVIDIA_CONFIG.apiKey}`,
    },
  })
}

/**
 * Creates a direct OpenAI client pointing to NVIDIA endpoint
 *
 * Usage:
 * ```typescript
 * const nvidia = createNvidiaClient()
 * const response = await nvidia.chat.completions.create({ ... })
 * ```
 */
export const createNvidiaClient = () => {
  return new OpenAI({
    apiKey: NVIDIA_CONFIG.apiKey,
    baseURL: NVIDIA_CONFIG.baseURL,
  })
}

/**
 * Helper function for automatic fallback from primary to backup model
 *
 * Usage:
 * ```typescript
 * const result = await callWithFallback(
 *   () => streamText({ model: primaryModel, ... }),
 *   () => streamText({ model: backupModel, ... })
 * )
 * ```
 */
export async function callWithFallback<T>(
  primaryCall: () => Promise<T>,
  backupCall: () => Promise<T>
): Promise<T> {
  try {
    return await primaryCall()
  } catch (error) {
    console.error('Primary model failed, falling back to backup:', error)
    return await backupCall()
  }
}

/**
 * Get recommended parameters for Kimi 2.5 model based on use case
 */
export const getKimiParams = (mode: 'thinking' | 'instant' = 'thinking') => {
  return NVIDIA_CONFIG.params.kimi[mode]
}
