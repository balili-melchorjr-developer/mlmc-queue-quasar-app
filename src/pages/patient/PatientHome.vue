<template>
  <div class="q-pa-md">
    <div class="row">
      <div class="col-xs-6 col-sm-6 col-md-6">
        <h4 class="text-h4 text-weight-light">Patient Home</h4>
        <h5 class="text-h5 text-weight-medium">{{ patientDetail.last_name }}, {{ patientDetail.first_name }} {{ patientDetail.middle_name }}</h5>

        <template v-if="nurseCallStatus === false">
          <q-btn label="Nurse Call" @click="nurseCallFn" class="q-mx-sm" color="primary"/>
        </template>
        <template v-else>
          <q-btn label="Nurse Call" disable @click="nurseCallFn" class="q-mx-sm" color="primary"/>
        </template>

        <q-btn label="Join Meeting" flat color="primary" class="q-mx-sm" @click="joinMeeting"/>
        <q-btn label="Logout" flat color="grey-8" class="q-mx-sm" @click="logout"/>
      </div>
      <div class="col-xs-6 col-sm-6 col-md-6">
        <h3 id="realTime" class="row justify-end text-weight-medium text-h3 text-uppercase q-mb-sm"></h3>
        <h4 id="dateToday" class="row justify-end text-h4 q-ma-none"></h4>
        <h5 id="dateDays" class="row justify-end text-weight-light text-h5 q-ma-none"></h5>
      </div>
    </div>


  </div>
</template>
<script>
import { api } from "boot/axios";
import { date } from "quasar";
import { Notify } from "quasar";

export default {
  name: "PatientHome",
  data() {
    return {

      patientDetail: [],
      patientAdmission: [],
      nurseCallStatus: '',

      accountDetail: []
    };
  },

  async mounted() {

    // ==================== Date and Time ====================

    let timeDisplay = document.getElementById("realTime")

    function refreshTime() {
      let dateString = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
      timeDisplay.innerHTML = dateString
      setTimeout(refreshTime, 1000)
    }

    refreshTime();

    const timeStamp = Date.now()
    const dateStamp = date.formatDate(timeStamp, 'MMMM D, YYYY')
    const dayStamp = date.formatDate(timeStamp, 'dddd')

    let dateToday = document.getElementById('dateToday')
    let dateDays = document.getElementById('dateDays')

    dateToday.innerHTML = dateStamp
    dateDays.innerHTML = dayStamp

    // ========================================================

    // ==================== Functions ====================
    await this.getAccountDetail()

    // ===================================================

    // ==================== WebSockets ====================

    // ----------------------- PatientListConnection ------------------------

    // let patient_account = sessionStorage.getItem('userid')
    let patientAdmissionWSConnection = new WebSocket(`ws://localhost:8000/ws/patient-account/${this.accountDetail.id}/`)

    patientAdmissionWSConnection.onopen = (event => {

      patientAdmissionWSConnection.send(JSON.stringify({
        action: "list",
        request_id: new Date().getTime(),
        // pk: 6
      }))

    })

    patientAdmissionWSConnection.onmessage = (response => {
      let patientAdmissionData = JSON.parse(response.data)

      // this.patientDetail = patientAdmissionData.data
      try {
        patientAdmissionData.data.map(x => {

          this.patientDetail = x.patient
          this.patientAdmission = x
          this.nurseCallStatus = x.nurse_call

      })
      } catch {
          console.log("error sheesh")

      }


      if(patientAdmissionData.action === "list") {
        patientAdmissionWSConnection.send(JSON.stringify({
          action: "list",
          request_id: new Date().getTime(),
          // pk: 6
        }))
      } else if(patientAdmissionData.action === "create") {
        patientAdmissionWSConnection.send(JSON.stringify({
          action: "list",
          request_id: new Date().getTime(),
          // pk: sessionStorage.getItem('userid')
        }))
      } else if(patientAdmissionData.action === "update") {
        patientAdmissionWSConnection.send(JSON.stringify({
          action: "list",
          request_id: new Date().getTime(),
          // pk: sessionStorage.getItem('userid')
        }))
      } else if(patientAdmissionData.action === "delete") {
        patientAdmissionWSConnection.send(JSON.stringify({
          action: "list",
          request_id: new Date().getTime(),
          // pk: sessionStorage.getItem('userid')
        }))
      }
    })



    // ----------------------------------------------------------------------

    // ----------------------- PatientDetailConnection ----------------------
    // ----------------------------------------------------------------------

    // ====================================================

     // ===================== Testing Area ===============================



     // ==================================================================
  },

  methods: {
    async getAccountDetail(){
      await api
        .get('/api/v1/users/me/')
        .then(response => {
          this.accountDetail = response.data
        })
        .catch(error => {
          console.log(error)
        })
    },

    async nurseCallFn() {

        let nurseCallData = {
          nurse_call: true
        }

        await api
        .put(`/api/v1/patient-admission/${this.patientAdmission.id}/`, nurseCallData)
        .then(response => {
          console.log(response.data)
        })
        .catch(error => {
          console.log(error)
        })

        // console.log(this.patientAdmission.id)

    },

    async joinMeeting(){
      console.log('Join Meeting')
    },

    async deletePost(props) {
      await api
        .delete(`/api/v1/post/${props.row.id}/`)
        .then(response => {
          Notify.create({
            message: 'Successfully Deleted',
            type: 'positive',
            position: 'top'
          })
        })
        .catch(error => {
          console.log(error)
        })
    },

    async logout() {
      await api
        .post('/api/v1/token/logout')
        .then(response => {
          api.defaults.headers.common['Authorization'] = ""
          sessionStorage.removeItem('token')
          sessionStorage.removeItem('email')
          sessionStorage.removeItem('userid')
          sessionStorage.removeItem('roles')
          this.$store.commit('removeToken')

          this.$router.push({name: 'PatientLogin'})
        })
        .catch(error => {
          console.log(error)
        })


    }

  },
};
</script>
