<template>
  <div class="welcome-popup" v-if="isVisible">
    <div class="blur"></div>
    <div class="welcome-popup__form">
      <div class="welcome-popup__title">Welcome to Planning Poker!</div>
      <input
        v-model="currentName"
        class="welcome-popup__input"
        placeholder="Type your full name"
        maxlength="20"
        @keyup.enter="onSubmit()"
      />
      <input
        v-model="currentRoomId"
        class="welcome-popup__input"
        placeholder="Type a room ID to join"
        maxlength="20"
        @keyup.enter="onSubmit()"
      />
      <button @click="onSubmit()">Go!</button>
    </div>
  </div>
</template>
<script src="./WelcomePopup.js"></script>
<style src="./WelcomePopup.scss" lang="scss"></style>
