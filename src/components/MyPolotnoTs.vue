<template>
  <div
    class="my-polotno"
    :class="mobileClass"
  >
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
import { useBookCoverStore } from '../stores/polotno';
import { ref, onMounted, computed, onBeforeUnmount } from 'vue';
import type { Ref } from 'vue';
import { setTranslations } from 'polotno/config';
import translations from '../data/translations.json';

const piniaStore = useBookCoverStore();

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

const isMobile = ref<boolean>(false);

const checkMobile = () => {
  isMobile.value = window.innerWidth <= 768;
};

const coverData = computed(() => piniaStore.coverData);

const mobileClass = computed(() => (isMobile.value ? 'polotno-mobile' : ''));

const makeImage = async () => {
  const image = await (myStore.value as StoreType).toDataURL();
  let currentCoverData: Record<string, any>[] = [];
  if (myStore.value) {
    myStore.value.pages[0].children.forEach((el: Record<string, any>) => {
      const plainObject = JSON.parse(JSON.stringify(el));
      currentCoverData.push(plainObject);
    })
  }
  piniaStore.addCover(currentCoverData);
  emit('set-image', image);
}

onMounted(() => {
  checkMobile();
  window.addEventListener('resize', checkMobile);

  const element = polotno.value;

  if (element) {
    const rect = element.getBoundingClientRect();
    window.scrollBy({
      top: rect.top,
      behavior: 'smooth'
    });
  }

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
    ],
  });
  
  myStore.value = store;

  store.pages[0].set({
    width: 200,
    height: 285,
  });

  if (coverData.value.length > 0) {
    coverData.value.forEach((el) => {
      store.activePage?.addElement(el);
    })
  } else {
    store.activePage?.addElement({
      type: 'text',
      x: 50,
      y: 205,
      fill: 'black',
      text: props.bookName,
      alwaysOnTop: true,
      fontFamily: "Pacifico",
      fontSize: 20,
    });
  }
  /*
    при установке кастомных размеров странице (200x285), изображения появляются далеко в стороне,
    и не совпадают по размеру. По дефолту количество элементов в children у страницы один - текст.
    Следим за изменениями на странице, если элементов стало больше, проверяем что новый элемент - изображение,
    и ставим его на обложку, подстраивая размер.
  */
  let childs = 1;
  store.on('change', () => {
    const childrenLength = store.activePage.children.length;
    // проверяем что добавился элемент страницы
    if (childrenLength > childs) {
      const newChildren = store.activePage.children.slice(childs, childrenLength);
      // обрабатываем новые элементы
      newChildren.forEach((child) => {
        // если изображение - делаем его размером страницы, и располагаем на ней
        if (child.type === 'image') {
          child.set({x: 0, y: 0});
          if (typeof store.activePage.width === 'number' && typeof store.activePage.height === 'number') {
            child.set({width: store.activePage.width, height: store.activePage.height});
          }
          // Если текст - сбрасываем настройки. дефолтные примеры сложно обработать чтобы они выглядели нормально.
        } else if (child.type === 'text') {
          child.set({x: 0, y: 0, fontSize: child.fontSize / 3});        }
    });
    }
    childs = childrenLength;
  });
  setTranslations(translations);
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', checkMobile);
});
</script>