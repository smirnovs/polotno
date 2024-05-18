<template>
  <div class="personal-account">
    <h1>Создание обложки для вашей книги</h1>
    <div class="personal-account__container">
      <div v-if="!isShowForm">
        <div v-if="!coverImage.length">
          Для создания обложки введите в поле ниже название книги, и нажмите на кнопку "Создать"
        </div>
        <div v-else>
          Ваша обложка:
          <div>
            <img :src="coverImage" alt="">
          </div>
        </div>
        <div class="personal-account__form">
          <input
            type="text"
            placeholder="Название книги"
            v-model="bookName"
            @keydown.enter="handleAdded"
          />
          <div class="personal-account__form-button">
            <button
              @click="handleAdded"
              :disabled="!bookName.length"
            >
              <template v-if="coverImage.length">
                Попробовать еще раз
              </template>
              <template v-else>
                Создать обложку
              </template>
            </button>
          </div>
        </div>
      </div>
      <div v-else>
        <my-polotno-ts
          :book-name="bookName"
          @set-image="handleImageSet"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import MyPolotnoTs from './MyPolotnoTs.vue'

import { ref } from 'vue';

const isShowForm = ref(false);
const bookName = ref('');
const coverImage = ref('');

const handleAdded = () => {
  if (bookName.value.length) {
    isShowForm.value = true;    
  }
}

const handleImageSet = (image: string) => {
  coverImage.value = image;
  isShowForm.value = false;
  bookName.value = '';
}
</script>