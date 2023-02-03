<template>
  <q-layout view="hHh lpR lFr">
    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-btn dense flat round icon="menu" @click="toggleLeftDrawer" />

        <q-toolbar-title> Makati Life Medical Center </q-toolbar-title>

        <q-btn no-caps flat>
          <q-avatar size="md" class="q-mr-md" color="grey">J</q-avatar>
          <q-menu class="q-mt-md" transition-show="jump-down" transition-hide="jump-up">
            <q-list style="min-width: 100px">
              <q-item clickable @click="logout" v-ripple>
                <q-item-section flat class="text-red-10">Logout</q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>

        <q-btn dense flat round icon="menu" @click="toggleRightDrawer" />
      </q-toolbar>
    </q-header>

    <q-drawer show-if-above v-model="leftDrawerOpen" side="left" bordered>
      <!-- drawer content -->
      <div class="row justify-center q-my-lg">
        <q-avatar size="70px" class="q-my-sm">
          <img src="data:image/jpeg;base64,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"/>
        </q-avatar>
        <div class="text-weight-bold col-md-12 text-center">your_cool_name_here</div>
        <div class="col-md-12 text-center">your_proud_designation_here</div>
      </div>

      <q-separator/>

      <q-list paddding class="q-mt-md">

        <q-item clickable active-class="my-menu-link" :to="{name: 'NurseDesk'}">
          <q-item-section avatar>
            <q-icon name="dvr" />
          </q-item-section>
          <q-item-section>
            Nurse Desk
          </q-item-section>
        </q-item>

        <q-item clickable active-class="my-menu-link" :to="{name: 'PatientList' }">
          <q-item-section avatar>
            <q-icon name="people"/>
          </q-item-section>
          <q-item-section>
            Patient
          </q-item-section>
        </q-item>

      </q-list>

    </q-drawer>

    <q-drawer show-if-above v-model="rightDrawerOpen" side="right" bordered>
      <!-- drawer content -->
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>

  </q-layout>
</template>

<script>
import { api } from "src/boot/axios";
import { ref } from "vue";

export default {
  setup() {
    const leftDrawerOpen = ref(false);
    const rightDrawerOpen = ref(false);

    return {
      leftDrawerOpen,
      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value;
      },

      rightDrawerOpen,
      toggleRightDrawer() {
        rightDrawerOpen.value = !rightDrawerOpen.value;
      },
    };
  },
  methods: {
    async logout() {
      await api
        .post('/api/v1/token/logout')
        .then(response => {

        })
        .catch(error => {
          console.log(error)
        })

        api.defaults.headers.common['Authorization'] = ""
        sessionStorage.removeItem('token')
        sessionStorage.removeItem('email')
        sessionStorage.removeItem('userid')
        sessionStorage.removeItem('roles')
        this.$store.commit('removeToken')

        this.$router.push({name: 'Login'})
    }
  }
};
</script>
