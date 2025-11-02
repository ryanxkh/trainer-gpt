export async function getCloudflareContext() {
  // This helper is for Cloudflare Workers context when deployed
  // In development, falls back to process.env
  try {
    // @ts-ignore - Cloudflare context only available in edge runtime
    const cloudflareModule = await import('@opennextjs/cloudflare');
    return {
      env: (cloudflareModule as any).env || process.env,
      cf: (cloudflareModule as any).cf || {},
      ctx: (cloudflareModule as any).ctx || {}
    };
  } catch {
    return {
      env: process.env as any,
      cf: {} as any,
      ctx: {} as any
    };
  }
}
