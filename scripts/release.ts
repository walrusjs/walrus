/**

 如何发布：

 1. 确保您具有所有软件包的发布权限:
 - 您必须是npm @walrus组织成员
 - 您必须具有发布walrus-version-marker的权限
 - 确保您没有启用 npm per-publish 2-factor / OTP, 因为它不适用于Lerna（我们用于批量发布）。

 2. 运行`yarn release`，按照提示进行操作

 3A. 如果一切正常，则标签应已自动按入，并且本地变更日志提交应该已经生成。转到4。

 3B. 如果发布中途失败，则事情变得很繁琐。现在你需要转到npm检查哪些软件包已经发布并手动发布尚未发布的。

 3B.1. 将release git标签推送到GitHub。
 3B.2. 运行`yarn changelog`来生成changelog提交。

 4. 将更改日志提交推送到`dev`分支。

 5. 转到GitHub并验证变更日志是否处于活动状态。

 6. 转到GitHub版本页面并发布版本（这对于发布遇到问题的版本）

 Note: eslint-config-* packages should be released separately & manually.

 */
