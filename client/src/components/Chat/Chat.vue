<template>
  <div class="chat">
    <div class="chat__messages" ref="chat-messages">
      <div
        v-for="(message, index) in chatMessages"
        class="chat__message"
        :key="index"
      >
        <span class="chat__message-user">
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
  </div>
</template>
<script src="./Chat.js"></script>
<style src="./Chat.scss" lang="scss"></style>
