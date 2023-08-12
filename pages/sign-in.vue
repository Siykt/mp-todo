<script setup lang="ts">
import type { Provider } from '@supabase/gotrue-js'

const supabase = useSupabaseClient()

const email = ref('')
const password = ref('')
const showMsg = ref(false)
const msg = ref('')

const appConfig = useAppConfig()

async function signInWithOAuth(provider: Provider) {
  const { error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `${appConfig.WEBSITE_URL}/confirm`,
    },
  })
  if (error)
    console.error(error)
}
async function signInWithPassword() {
  if (!email.value) {
    msg.value = '请输入邮箱地址'
    showMsg.value = true
    return
  }
  if (!password.value) {
    msg.value = '请输入密码'
    showMsg.value = true
    return
  }
  const { error } = await supabase.auth.signInWithPassword({
    email: email.value,
    password: password.value,
  })
  if (error) {
    msg.value = { 'Invalid login credentials': '无效的邮箱地址或密码错误' }[error.message] || error.message
    showMsg.value = true
  }
}
</script>

<template>
  <div class="flex flex-1 flex-col overflow-hidden">
    <h1 class="m0 flex items-center bg-#e7eaed p3 text-xl font-medium text-#333">
      <a href="https://www.antpro.me/" title="Siykt的博客">
        <img class="mr-6px h-42px w-42px" src="~/assets/logo.png" alt="logo.png">
      </a>
      <span>TODO</span>
    </h1>
    <div class="mx-auto min-h-1px w-full flex flex-1 flex-col gap-2 p4 text-#333 md:w-460px md:px8">
      <h2 class="flex flex-col text-base">
        登录到您的账户
        <span class="text-12px">登录后即可使用、自定义您的待办事项</span>
      </h2>
      <div class="my-2 flex flex-col gap-2">
        <AButton class="flex items-center justify-center gap-1" @click="signInWithOAuth('google')">
          <i class="mdi:google" />
          使用 Google 登录
        </AButton>
        <AButton class="flex items-center justify-center gap-1" @click="signInWithOAuth('github')">
          <i class="mdi:github" />
          使用 Github 登录
        </AButton>
        <p class="text-center text-sm">
          或使用邮箱登录
        </p>
        <div class="flex flex-col">
          <span>邮箱：</span>
          <AInput v-model="email" class="mt-2" name="email" placeholder="请输入邮箱地址" />
        </div>
        <div class="flex flex-col">
          <span>密码：</span>
          <AInput v-model="password" class="mt-2" type="password" placeholder="请输入账户密码" />
        </div>
        <p class="my-2 text-12px">
          <span>登录或注册即表示同意</span>
          <a class="mx1" href="">用户协议</a>
          <span>、 </span>
          <a class="mx1" href="">隐私声明</a>
          <span>，否则请勿使用本站服务</span>
        </p>
        <AButton @click="signInWithPassword">
          登录/注册
        </AButton>
      </div>
    </div>
  </div>
</template>
