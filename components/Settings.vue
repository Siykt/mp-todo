<script setup lang="ts">
import { useAuth } from '~/lib/hooks/useAuth'
import { useSettingsStore } from '~/lib/hooks/useSettingsStore'

const { settings, saveLocalSettings } = useSettingsStore()
const { configured } = useAuth()
</script>

<template>
  <div class="min-h-0 flex-1 overflow-y-auto rounded-md bg-#f3f4f6 p4">
    <div v-if="configured" class="min-h-0 overflow-y-auto rounded-md bg-#f3f4f6 p4">
      <div class="flex flex-col items-center justify-center gap-2">
        <i class="mdi:emoticon-happy-outline text-42px text-#6c6cc9" />
        <span class="text-14px text-#6c6cc9">服务端已配置，您的本地设置将会覆盖服务端的配置</span>
      </div>
    </div>
    <!-- QStash配置 -->
    <div class="card">
      <div class="title">
        <span>QStash配置</span>
        <i class="mdi:information-slab-circle ml-2 opacity-88" />
        <span class="ml-2px text-12px opacity-88">用于实现定时发送邮件</span>
        <a class="ml-auto text-12px text-#6c6cc9" target="_blank" href="https://console.upstash.com/qstash">Upstash/QStash链接</a>
      </div>
      <div class="body">
        <form>
          <div class="form-item">
            <div class="label">
              Authorization
            </div>
            <div class="value">
              <AInput v-model="settings.authorization" placeholder="请输入QStash的Authorization" @blur="saveLocalSettings" />
            </div>
          </div>
        </form>
      </div>
    </div>
    <!-- 邮件发送配置 -->
    <div class="card">
      <div class="title">
        <span>SMTP配置</span>
        <i class="mdi:information-slab-circle ml-2 opacity-88" />
        <span class="ml-2px text-12px opacity-88">使用SMTP协议发送邮件的配置</span>
        <a
          class="ml-auto text-12px text-#6c6cc9"
          target="_blank"
          href="https://www.wbolt.com/outlook-smtp-settings.html#outlook-smtp-settings"
        >
          SMTP配置教程
        </a>
      </div>
      <div class="body">
        <form>
          <div class="form-item">
            <div class="label">
              接收消息提示的邮箱地址
            </div>
            <div class="value">
              <AInput v-model="settings.email" placeholder="请输入邮箱地址" @blur="saveLocalSettings" />
            </div>
          </div>
          <div class="form-item">
            <div class="label">
              SMTPHost
            </div>
            <div class="value">
              <AInput v-model="settings.SMTPHost" placeholder="请输入SMTPHost" @blur="saveLocalSettings" />
            </div>
          </div>
          <div class="form-item">
            <div class="label">
              SMTPPort
            </div>
            <div class="value">
              <AInput v-model="settings.SMTPPort" placeholder="请输入SMTPPort" @blur="saveLocalSettings" />
            </div>
          </div>
          <div class="form-item">
            <div class="label">
              SMTPUser
            </div>
            <div class="value">
              <AInput v-model="settings.SMTPUser" placeholder="请输入SMTPUser" @blur="saveLocalSettings" />
            </div>
          </div>
          <div class="form-item">
            <div class="label">
              SMTPFrom
            </div>
            <div class="value">
              <AInput v-model="settings.SMTPFrom" placeholder="请输入SMTPFrom" @blur="saveLocalSettings" />
            </div>
          </div>
          <div class="form-item">
            <div class="label">
              SMTPPass
            </div>
            <div class="value">
              <AInput v-model="settings.SMTPPass" type="password" placeholder="请输入SMTPPass" @blur="saveLocalSettings" />
            </div>
          </div>
          <div class="form-item">
            <div class="label flex items-center gap-2">
              SMTPTLS
              <ASwitch v-model="settings.SMTPTLS" @change="saveLocalSettings" />
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.card {
  max-width: 876px;
  border: 2px solid rgb(233, 233, 233);
  border-radius: 8px;
  margin-bottom: 14px;
  overflow: hidden;
  .title {
    display: flex;
    align-items: center;
    background: rgb(240, 245, 255);
    font-weight: bold;
    font-size: 14px;
    color: #6c6cc9;
    padding: 12px 28px;
  }
  .body {
    padding: 12px 28px;
    position: relative;
    background-color: #fff;
  }
  .label {
    font-weight: bold;
    font-size: 12px;
    color: rgb(107, 119, 140);
    line-height: 30px;
  }
  .form-item {
    padding-bottom: 15px;
    padding-top: 5px;
  }
}
</style>
