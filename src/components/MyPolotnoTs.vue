<template>
  <div class="my-polotno">
    <div class="my-polotno__annotation">
      Вы можете загружать свои изображения, добавлять свои шрифты, или использовать уже существующие в приложении.<br />
      Если вы хотите взять текст из примера во вкладке "тексты", то <strong>перетащите</strong> текст на вашу обложку. <br /><br />
      После настройки изображения нажмите на кнопку:
    </div>
    <button @click="makeImage">Применить</button> 
    <link
      href="https://unpkg.com/@blueprintjs/core@5/lib/css/blueprint.css"
      rel="stylesheet"
    />
    <div id="polotno" ref="polotno"></div>
  </div>
</template>

<script setup lang="ts">
import { createPolotnoApp } from 'polotno/polotno-app';
import { ref, onMounted } from 'vue';
import type { Ref } from 'vue';
import { setTranslations } from 'polotno/config';
import translations from '../data/translations.json';

interface Props {
  bookName: string;
}

interface StoreType {
  role: string;
  pages: {
    id: string;
    children: any[];
    width: number | 'auto';
    height: number | 'auto';
  }[];
  toDataURL: Function,
}

const props = defineProps<Props>();
const emit = defineEmits(['set-image']);

const polotno = ref<HTMLDivElement | null>(null);
const myStore: Ref<StoreType | null> = ref(null);

const makeImage = async () => {
  const image = await (myStore.value as StoreType).toDataURL();
  emit('set-image', image);
}

onMounted(() => {
  const { store } = createPolotnoApp({
    container: polotno.value!,
    key: 'i7akWeWtbBUw7l3rttYZ',
    showCredit: true,
    sections: [
      'photos',
      'text',
      'elements',
      'upload',
      'background',
      'layers',
      'size',
    ],
  });
  
  myStore.value = store;

  store.pages[0].set({
    width: 200,
    height: 285,
    useMagic: true,
  });

  store.activePage?.addElement({
    type: 'text',
    x: 50,
    y: 205,
    fill: 'black',
    text: props.bookName,
    alwaysOnTop: true,
    fontFamily: "Pacifico",
  });

  /*
    при установке кастомных размеров странице (200x285), изображения появляются далеко в стороне,
    и не совпадают по размеру. По дефолту количество элементов в children у страницы один - текст.
    Следим за изменениями на странице, если элементов стало больше, проверяем что новый элемент - изображение,
    и ставим его на обложку, подстраивая размер.
  */
  let childs = 1;
  store.on('change', () => {
    const childrenLength = store.activePage.children.length;
    if (childrenLength > childs) {
      const index = childrenLength - 1;
      console.log(store.activePage.children[index])
      if (store.activePage.children[index].type === 'image') {
        store.activePage.children[index].x = 0;
        store.activePage.children[index].y = 0;
        if (typeof store.activePage.width === 'number' && typeof store.activePage.height === 'number') {
          store.activePage.children[index].width = store.activePage.width;
          store.activePage.children[index].height = store.activePage.height;
        }
      }
    }
    childs = childrenLength;
  });
  setTranslations(translations);
});
</script>