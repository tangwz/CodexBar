**隔离 App 真实运行证据 · 最新源码 bcda9e66f12848277e17490f7100822d1b98a4a7**

这里收集两组实际 App 证据。完整升级、统计、分享和失败场景采集于 20da67d6ea07394ab201797a6647ef8b6345b5d9；可空日报修复的专项场景采集于最新源码 bcda9e66f12848277e17490f7100822d1b98a4a7。全部来自真实启动的 App 和原生控件，没有在测试中直接构造统计模型。

最新源码的[七日汇总](nullable-summary.png)和[日报明细](nullable-ledger.png)展示：feed 中 11 月 1 日的 tokens/requests 未知，位于七日周期外；11 月 13 日仍显示 123 tokens / 2 requests，14 日保持明确的 0 / 0，缺失日期维持未知。此场景使用单独的无凭据临时配置，经正常发现与 UI 批准载入 [Nullable Fixture](nullable-fixture.js)。[核对记录](nullable.json)和[固定合成日志](nullable-runtime.log)记录了源码、fixture 指纹和观察值。

以下完整升级场景使用复制的 0.84.0 发行版和 20da67d 构建，复用相同独立 bundle identifier、临时 home、插件文件、配置和批准记录。仅 bundle 元数据、可执行文件名、调试产物的 Frameworks 搜索路径及临时签名经过隔离打包调整，产品源码未插入证明逻辑。

测试只启用无凭据的 Community Fixture。插件声明公开的 example.com，但不发 HTTP 请求，不读取 cookies、Keychain 或账户文件。所有原生提供商、首次提供商探测、旧凭据迁移、云同步及自动更新均关闭。原有安装未修改或重启。

- [批准界面](baseline-approval.png)：0.84.0 通过正常插件发现和批准流程载入 fixture；权限为 network，Auth 和 Secrets 均为 none。
- [升级前](baseline-statistics.png)：同一插件返回配额和合成详情，但旧主机不公布 v2 能力，全局统计为空。
- [升级后统计](statistics.png)：新版统计为 1,500 tokens、1 个来源、3/30 天覆盖，费用未知。输入与输出合计 1,500；缓存读取 500、写入 20 单列，没有重复相加。
- [活动图](activity.png)：覆盖 3/365 天；显式零保留为已知零，其余日期保持 unavailable。
- [真实预览](share-preview.png)、[原生保存 PNG](share.png) 和 [复制文字](share.txt) 一致；Copy Image 取得的 PNG 与 Save 导出的文件逐字节相同。
- [失败刷新](plugin-failure.png)：将普通 MODE 设置为 fail 并刷新，错误保持可见。[统计页](statistics-after-failure.png) 随后排除该来源并禁用分享。此场景同时涉及配置更新；同配置的失败刷新和强制刷新竞争由回归测试覆盖。

[核对记录](upgrade.json) 包含 fixture 和批准记录的 SHA-256，以及升级前后配置一致的核对结果。[日志](runtime.log) 仅保留合成 fixture 自己的固定日志，不含凭据、IP、私有端点或真实账户数据。基线进程为 83775，升级/分享场景的 20da67d 构建进程为 97177；最新可空日报场景的 bcda9e6 构建进程为 11347。

复现时，将 [fixture](community-fixture.js) 放入独立临时 home 的默认插件目录，只启用该 ID，并用该 home 启动隔离打包副本。两个版本必须使用相同独立 bundle identifier。启动前在其独立 defaults 域设置 providerDetectionCompleted 和 codexbar.legacySecretsMigrationCompleted 为真正的 Boolean true，关闭所有原生提供商，并通过以下环境变量约束读取位置及 Keychain；不要直接双击没有隔离环境的测试副本。先在 0.84.0 批准并刷新，再复用同一配置运行源码构建，进入 Usage & Spend（30d，Asia/Shanghai），检查分享，再将 MODE 改为 fail 刷新。

```text
HOME=<synthetic-home>
CFFIXED_USER_HOME=<synthetic-home>
CODEXBAR_CONFIG=<synthetic-home>/.config/codexbar/config.json
XDG_CONFIG_HOME=<synthetic-home>/.config
CODEX_HOME=<synthetic-home>/.codex
CLAUDE_CONFIG_DIR=<synthetic-home>/.claude
CODEXBAR_DISABLE_KEYCHAIN_ACCESS=1
CODEXBAR_SUPPRESS_TEST_KEYCHAIN_ACCESS=1
```

最新源码已完成 871 项相关 Swift Testing 测试、隔离 XCTest 和 make check；完整平台 CI 在功能分支执行。本证明分支只保存证据文件，不进入功能 PR 的 diff。
