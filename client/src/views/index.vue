<template>
  <div class="container">
    <a href="https://planning-poker.alexniarchos.com" class="brand">
      <div class="logo">PP</div>
      <span>Planning Poker</span>
    </a>
    <div class="time">
      {{time}}
    </div>
    <div class="room">
      <span class="room__label">Room:</span>
      <div
        v-show="!roomIdFocused"
        class="room__id-div"
        placeholder="username"
        @click="onRoomIdClick()"
        ref="room__id-div"
      >
        {{newRoomId}}
      </div>
      <input
        v-show="roomIdFocused"
        class="room__id-input"
        v-model="newRoomId"
        @keyup.enter="onRoomChange()"
        @blur="onRoomIdBlur()"
        placeholder="room id"
        ref="room__id-input"
      />
      <button
        v-if="roomId !== newRoomId"
        class="room__join"
        @mousedown="onRoomChange()"
      >
        Join
      </button>
    </div>

    <div
      v-show="!usernameFocused"
      class="username"
      placeholder="username"
      @click="onUserNameClick()"
      ref="username-div"
    >
      {{newUserName}}
    </div>
    <input
      v-show="usernameFocused"
      ref="username-input"
      class="username__input"
      v-model="newUserName"
      @keyup.enter="onUserNameBlur()"
      @blur="onUserNameBlur()"
    />

    <div class="table">
      <div
        v-for="(user, index) in users"
        :class="['user', {'user--self': userId === user.id}]"
        :key="user.id"
        :style="userIconStyle(user, index)"
      >
        <div class="user__name">
          {{getUserInitials(user.name)}}
        </div>
        <div :class="['user__card', {'user__card--show': user.hasVoted}]" :style="cardStyle(user)">
          <transition name="fade">
            <div v-if="user.vote !== null" :class="['user__card-number', {'user__card-number--reversed': isCardNumberReversed(user)}]">
              {{user.vote}}
            </div>
          </transition>
        </div>
        <tooltip class="user__tooltip" :text="user.name" />
      </div>
      <button v-if="showRevealButton" @click="onRevealClick()" class="table__cta">
        {{revealText}}
      </button>
    </div>
    <transition name="slide-fade">
      <div v-if="cardsVisible" class="cards-deck">
        <div
          v-for="(card, index) in cards"
          @click="selectCard(index)"
          :class="['cards-deck__card', {'cards-deck__card--selected': selectedCardIndex === index}]"
          :key="index"
        >
          <div class="cards-deck__card-number">
            {{card}}
          </div>
        </div>
      </div>
    </transition>
    <chat />
    <welcome-popup />
  </div>
</template>
<script src="./index.js"></script>
<style src="./index.scss" lang="scss"></style>
