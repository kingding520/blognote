# Markdown 个人博客

自行修改页面请看 [页面修改手册](页面修改手册.md)。

包含首页、独立文章列表、分类、文章目录、左右侧栏、明暗主题和同分类文章翻页。界面使用 Material Symbols 图标和深色紫色系组件。

## 本地运行

需要 Node.js 24 或更新版本。

```bash
npm ci
npm run dev
```

运行 `npm run build` 可生成 `dist/` 静态文件。

## 写文章

在 `src/content/posts/` 新增 `.md` 文件。文件顶部填写：

```yaml
---
title: 文章标题
description: 一句话摘要
date: 2026-11-18
category: 笔记
tags: [Markdown, 写作]
draft: false
---
```

正文使用 Markdown。二级和三级标题会出现在左侧文章目录。`draft: true` 的文章不会发布。可复制 `src/content/posts/template.md` 开始写作，发布时将 `draft` 改为 `false`。作者资料在 `src/site.config.ts` 中填写；留空时不显示。页面标题与导航文字位于 `src/layouts/SiteLayout.astro`。

图标使用本地 Material Symbols 字体，许可证见 `src/assets/fonts/LICENSE`。

## 阅读日历与 Google Calendar

右侧栏显示当前访客授权的 Google Calendar 中全部活动，包括重复活动的每次实例；可新增、修改、删除活动并同步写回。编辑或删除重复活动实例只影响所选的那一次。全天和跨天活动也会显示在对应日期。日历数据只在当前访客的浏览器中读取，不会把博主的私人日历公开给其他访客。Web Client ID 已写入 `src/calendar.config.ts`；仍需在 Google Cloud 配置授权来源和测试用户，具体步骤见 [页面修改手册](页面修改手册.md#配置-google-日历同步)。

点击右侧小日历的日期可打开当日时间轴，查看、添加或编辑活动。同步按钮或切回博客窗口可读取 Google 日历中的最新改动。当前标签页会暂存短期访问令牌，切换博客页面或刷新后可继续使用；令牌过期、关闭标签页或主动断开后需要重新连接。

## 上传 GitHub Pages

将代码推送至 GitHub 仓库的 `main` 或 `master` 分支。在仓库 **Settings → Pages → Build and deployment** 中选择 **GitHub Actions**。工作流将自动构建并部署。普通仓库会使用 `/<仓库名>/` 路径；`<用户名>.github.io` 仓库使用根路径。

如需使用自定义域名，可在 GitHub Pages 设置中添加域名，并调整 `SITE_URL` 与 `astro.config.mjs` 中的站点地址配置。
