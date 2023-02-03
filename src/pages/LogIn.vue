<template>
  <div class="full-width row content-center">
    <div class="col-xs-12 col-sm-12 col-md-6">
      <h4>_makati_life_logo</h4>
      <h3>For Staff</h3>
    </div>
    <div class="col-xs-12 col-sm-12 col-md-6">
      <q-card style="width: 80%; margin-top: 10%">
        <q-card-section>
          <h4 class="q-mx-md text-h4 q-mb-sm">Login</h4>
        </q-card-section>
        <q-card-section class="q-pa-xl">
          <q-form @submit="onSubmit" class="q-gutter-md">
            <q-input
              v-model="email"
              label="Email Address"
              lazy-rules
              type="email"
            />
            <q-input v-model="password" label="Password" :type="isPwd ? 'password' : 'text'" :rules="[val => val && val.length > 0 || 'Please type something.']">
              <template v-slot:append>
                <q-icon
                  :name="isPwd ? 'visibility_off' : 'visibility'"
                  class="cursor-pointer"
                  @click="isPwd = ! isPwd"
                />
              </template>
            </q-input>

            <q-card-actions align="right" class="q-mt-xl">
              <q-btn style="width: 20%" rounded label="Login" type="submit"/>
            </q-card-actions>
         </q-form>
        </q-card-section>
      </q-card>
    </div>

  </div>
</template>

<script>

import { api } from 'boot/axios'
import { Notify } from 'quasar'

export default{
  name: 'LogIn',
  data() {
    return {
      email: '',
      password: '',
      isPwd: true,
      errors: []
    }
  },
  methods: {
    async onSubmit() {
      api.defaults.headers.common['Authorization']
      sessionStorage.removeItem('token')

      const formData = {
        email: this.email,
        password: this.password
      }

      await api
        .post('/api/v1/token/login/', formData)
        .then(response => {
          try{
            const token = response.data.auth_token
            this.$store.commit('setToken', token)
            api.defaults.headers.common['Authorization'] = 'Token ' + token
            sessionStorage.setItem('token', token)
          } catch {

          }
        })
        .catch(error => {

        })
      await api
        .get('/api/v1/users/me')
        .then(response => {
          try{
            this.$store.commit('setUser', {'id': response.data.id, 'email': response.data.email})
            sessionStorage.setItem('email', response.data.email)
            sessionStorage.setItem('userid', response.data.id)

            this.$router.push({name: 'NurseDesk'})
          }catch{
            console.log(clear)
          }
        })
        .catch(error => {
          Notify.create({
            message: 'Incorrect username or password.',
            type: 'negative',
            position: 'top'
          })
        })
    }
  }
}

</script>
