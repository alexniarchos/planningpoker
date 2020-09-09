<template>
  <div :class="['chat', {'chat--open': isChatOpen}]">
    <div v-if="!isChatOpen" class="chat__icon" @click="isChatOpen = true">Chat</div>
    <template v-else>
      <div class="chat__title">
        Chat
        <div class="chat__close" @click="isChatOpen=false">×</div>
      </div>
      <div class="chat__messages" ref="chat-messages">
        <div
          v-for="(message, index) in chatMessages"
          class="chat__message"
          :key="index"
        >
          <span
            :class="[
              'chat__message-user',
              {'chat__message-user--important': message.senderId === 'Server'}
            ]"
            :style="usernameStyle(message.senderId)"
          >
            {{formatUsername(message)}}
          </span>
          <span class="chat__message-text" v-html="message.text" />
        </div>
      </div>
      <div class="chat__input">
        <input
          type="text"
          placeholder="Say hi!"
          v-model="chatInput"
          @keyup.enter="onSendClick()"
        >
        <button @click="onSendClick()">Send</button>
      </div>
    </template>
  </div>
</template>
<script src="./Chat.js"></script>
<style src="./Chat.scss" lang="scss"></style>
