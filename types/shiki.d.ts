declare module "shiki" {
  export function codeToHtml(
    code: string,
    options: {
      lang: string
      theme?: string
      [key: string]: unknown
    },
  ): Promise<string>
}
