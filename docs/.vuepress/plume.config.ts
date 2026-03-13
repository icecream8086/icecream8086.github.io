/**
 * 查看以下文档了解主题配置
 * - @see https://theme-plume.vuejs.press/config/intro/ 配置说明
 * - @see https://theme-plume.vuejs.press/config/theme/ 主题配置项
 *
 * 请注意，对此文件的修改不会重启 vuepress 服务，而是通过热更新的方式生效
 * 但同时部分配置项不支持热更新，请查看文档说明
 * 对于不支持热更新的配置项，请在 `.vuepress/config.ts` 文件中配置
 *
 * 特别的，请不要在两个配置文件中重复配置相同的项，当前文件的配置项会覆盖 `.vuepress/config.ts` 文件中的配置
 */

import { defineThemeConfig, defineCollection, defineCollections } from 'vuepress-theme-plume'
import { enNavbar, zhNavbar } from './navbar'

/* =================== 定义集合 ======================= */

/**
 * 定义博客集合 (类型: post)
 * 将原本由 `blog` 配置管理的文章迁移至此。
 * 注意：你需要将所有的博客文章（原来散落在 docs/ 根目录下的 .md 文件）移动到一个统一的目录下，
 * 例如 `docs/blog/`。这里假设你已创建该目录并移入了所有博客文章。
 * @see https://theme-plume.vuejs.press/guide/quick-start/collection-post/
 */
const blogCollection = defineCollection({
  type: 'post',                 // 集合类型为 post
  dir: 'blog',                  // 指定博客文章所在的目录，相对于 docs 目录
  title: '博客',                 // 集合的显示名称
  /**
   * 以下为原 blog 配置中的选项，现在直接放在这里
   * @see https://theme-plume.vuejs.press/config/basic/#blog
   */
  postList: true,               // 是否启用文章列表页
  tags: true,                   // 是否启用标签页
  archives: true,               // 是否启用归档页
  categories: true,             // 是否启用分类页
  postCover: 'right',           // 文章封面位置
  pagination: 15,               // 每页显示文章数量
})

/**
 * 定义数据结构笔记集合 (类型: doc)
 * 对应原来的 `/test2/` 笔记。
 */
const dataStructureNote = defineCollection({
  type: 'doc',                  // 集合类型为 doc
  dir: 'data-structure',        // ⚠️ 建议将原来的 `test2` 目录重命名为更有意义的 `data-structure`
  title: '数据结构',              // 集合的显示名称
  linkPrefix: '/data-structure/', // 页面链接前缀，用于侧边栏匹配
  sidebar: 'auto',              // 自动生成侧边栏
})

/**
 * 定义计算机网络笔记集合 (类型: doc)
 * 对应原来的 `/network/` 笔记。
 */
const networkNote = defineCollection({
  type: 'doc',
  dir: 'network',
  title: '计算机网络',
  linkPrefix: '/network/',
  sidebar: 'auto',
})

/**
 * 定义操作系统笔记集合 (类型: doc)
 * 对应原来的 `/os/` 笔记。
 */
const osNote = defineCollection({
  type: 'doc',
  dir: 'os',
  title: '操作系统',
  linkPrefix: '/os/',
  sidebar: 'auto',
})

/**
 * 定义组合笔记集合 (类型: doc)
 * 对应原来的 `/composition/` 笔记。
 */
const compositionNote = defineCollection({
  type: 'doc',
  dir: 'composition',
  title: '组合',
  linkPrefix: '/composition/',
  sidebar: 'auto',
})

/**
 * 定义示例笔记集合 (类型: doc)
 * 对应原来的 `/demo/` 笔记。
 */
const demoNote = defineCollection({
  type: 'doc',
  dir: 'demo',
  title: '示例',
  linkPrefix: '/demo/',
  sidebar: ['', 'foo', 'bar'], // 使用自定义侧边栏
})

/**
 * 使用 defineCollections 将所有集合聚合在一起
 */
const zhCollections = defineCollections([
  blogCollection,
  dataStructureNote,
  networkNote,
  osNote,
  compositionNote,
  demoNote,
])

/**
 * @see https://theme-plume.vuejs.press/config/basic/
 */
export default defineThemeConfig({
  logo: 'https://theme-plume.vuejs.press/plume.png',

  appearance: true,  // 配置 深色模式

  social: [
    { icon: 'github', link: '/' },
  ],

  /**
   * 站点页脚
   */
  footer: {
    message: 'Power by <a target="_blank" href="https://v2.vuepress.vuejs.org/">VuePress</a> & <a target="_blank" href="https://theme-plume.vuejs.press">vuepress-theme-plume</a>',
    copyright: '',
  },

  locales: {
    '/': {
      profile: {
        avatar: 'https://theme-plume.vuejs.press/plume.png',
        name: '蜂巢网格',
        description: `icecream8086's blog`,
      },

      navbar: zhNavbar,
      collections: zhCollections, // ✅ 使用新的 collections 配置

      // 其他本地化配置...
    },
    '/en/': {
      profile: {
        avatar: 'https://theme-plume.vuejs.press/plume.png',
        name: 'Hex Grid',
        description: '',
      },

      navbar: enNavbar,
      // collections: enCollections, // 如果有英文笔记，也需要按此方式定义

      // 其他本地化配置...
    },
  },
})