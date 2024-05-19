<template>
  <div class="personal-account">
    <h1>Создание обложки для вашей книги</h1>
    <div class="personal-account__container">
      <div v-if="!isShowForm">
        <div v-if="!coverImage.length">
          Для создания обложки введите в поле ниже название книги, и нажмите на кнопку "Создать"
        </div>
        <div v-else>
          Ваша обложка. Вы можете: <button @click="download">скачать</button> ее или <button @click="isShowForm = true;">отредактировать</button>. <br />
          Или попробовать еще раз (под обложкой), с нуля.
          <div>
            <img :src="coverImage" alt="" class="personal-account__img">
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
import { useBookCoverStore } from '../stores/polotno';

const piniaStore = useBookCoverStore();

import { ref } from 'vue';

const isShowForm = ref<boolean>(false);
const bookName = ref<string>('');
const coverImage = ref<string>('');

const handleAdded = (): void => {
  if (bookName.value.length) {
    isShowForm.value = true;    
  }
  piniaStore.addCover([]);
}

const handleImageSet = (image: string) => {
  coverImage.value = image;
  isShowForm.value = false;
}

const download = (): void => {
  const link = document.createElement('a');
  link.href = coverImage.value;
  link.download = `${bookName.value}.jpg`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
</script>