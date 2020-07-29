<template>
  <div class="container">
    <div class="room">
      <span class="room__label">Room:</span>
      <input
        class="room__number"
        v-model="newRoomId"
        @keyup.enter="onRoomChange()"
        placeholder="room id"
        :style="roomIdStyle"
      />
      <button
        v-if="roomId !== newRoomId"
        class="room__join"
        @click="onRoomChange()"
      >
        Join
      </button>
      <button
        class="room__copy"
      >
        <img src="../assets/copy.svg" alt="copy"/>
      </button>
    </div>
    <input
      class="username"
      v-model="newUserName"
      @keyup.enter="onUserNameChange()"
      placeholder="username"
      :style="userNameWidth"
    />
    <div class="table">
      <div
        v-for="(user, index) in users"
        :class="['user', {'user--self': userId === user.id}]"
        :key="user.id"
        :style="userIconStyle(index)"
      >
        <div class="user__name" :style="userNameStyle(index)">
          {{getUserInitials(user.name)}}
        </div>
        <div v-if="user.hasVoted" class="user__card" :style="cardStyle(index)">
          <div class="user__card-number">
            {{cards[user.vote] || ''}}
          </div>
        </div>
        <div class="user__tooltip">
          {{user.name}}
        </div>
      </div>
      <button v-if="showRevealButton" @click="onRevealClick()" class="table__cta">
        {{revealText}}
      </button>
    </div>
    <div class="cards">
      <div
        v-for="(card, index) in cards"
        @click="selectCard(index)"
        :class="['card', {'card--selected': selectedCardIndex === index}]"
        :key="index"
      >
        <div class="card__number">
          {{card}}
        </div>
      </div>
    </div>
    <!-- <div class="chat">
      <div class="chat__messages">
        <div
          v-for="(message, index) in chatMessages"
          class="chat__message"
          :key="index"
        >
          {{getUserById(message && message.senderId).name}}: {{message.text}}
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
    </div> -->
  </div>
</template>
<script src="./index.js"></script>
<style src="./index.scss" lang="scss"></style>
