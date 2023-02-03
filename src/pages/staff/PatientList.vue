<template>
  <div class="q-pa-md">
    <div class="row q-my-lg">
      <div class="col-xs-12 col-sm-12 col-md-6">
        <h6 class="text-h6 text-weight-medium">Patients</h6>
      </div>
      <div class="col-xs-12 col-sm-12 col-md-6 row justify-end q-gutter-md">

        <q-card class="my-card">
          <q-card-section>

          </q-card-section>
        </q-card>

        <q-card class="my-card">
          <q-card-section>

          </q-card-section>
        </q-card>
      </div>
    </div>

    <q-table
      title="Patient"
      square
      flat
      bordered
      :rows="patientList"
      :columns="patientListColumn"
      row-key="name"
      :loading="patientTableLoading"
      color="primary"
    >
      <template v-slot:header="props">
        <q-tr :props="props">
          <q-th
            v-for="col in props.cols"
            :key="col.name"
            :props="props"

          >
          <div class="text-weight-medium text-center text-subtitle2">
            {{  col.label }}
          </div>

          </q-th>
        </q-tr>
      </template>

      <template v-slot:body="props">
        <q-tr :props="props" :class="(props.row.nurse_call === true)?'bg-orange-10 text-white':'bg-white text-black'">
          <q-td key="room" :props="props">
            <div class="text-subtitle2 text-center">
              {{ props.row.room.name }}
            </div>
          </q-td>
          <q-td key="patient" :props="props">
            <div class="text-subtitle2 text-left">
              {{ props.row.patient.last_name }}, {{ props.row.patient.first_name }} {{ props.row.patient.middle_name }}
            </div>
            <div class="text-weight-medium text-left">
              {{  props.row.patient.sex }}
            </div>
          </q-td>
          <q-td key="status" :props="props">
            <template v-if="props.row.nurse_call === false">
              <div class="text-subtitle2 text-center">
                Nurse Call
              </div>
            </template>
            <template v-else>
              <div class="text-subtitle2 text-center">
                Nurse Call
              </div>
            </template>
          </q-td>
          <q-td key="admission_date" :props="props">
            <div class="text-subtitle2 text-center">
              {{ dateMeridian(props.row.admission_date) }}
            </div>
            <div class="text-weight-medium text-center">
              {{ fullDate(props.row.admission_date ) }}
            </div>
          </q-td>
          <q-td key="action" :props="props">
            <div class="row justify-center ">
              <template v-if="props.row.nurse_call === false">
                <q-btn no-caps disable @click="nurseCall(props)" unelevated>Nurse Call</q-btn>
              </template>
              <template v-else>
                <q-btn no-caps @click="nurseCall(props)" unelevated>Nurse Call</q-btn>
              </template>
              <!-- <q-btn label="Delete" @click="nurseCallDialogFn(props)" color="negative"/> -->
              <q-btn label="Zoom" @click="zoomCall(props)" class="q-mx-md" color="primary"/>
            </div>
          </q-td>
        </q-tr>

      </template>
    </q-table>
    <q-dialog v-model="nurseCallDialog" persistent>
      <q-card>

        <q-card-section>
          <h6 class="text-h6 text-weight-medium">Nurse Call</h6>
        </q-card-section>

        <q-card-section class="row items-center">
          <q-avatar icon="person" color="primary" text-color="white" />
          <span class="q-ml-sm">{{ nurseCallDialogAction.patient.last_name }}, {{ nurseCallDialogAction.patient.first_name }} {{  nurseCallDialogAction.patient.middle_name }}</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="primary" v-close-popup />
          <q-btn flat label="Turn off Nurse Call" color="primary" @click="nurseCall" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>
<script>
import { api } from "boot/axios";
import { Notify, date } from "quasar";

export default {
  name: "PatientList",
  data() {
    return {

      patientListConnection: null,
      patientDetailConnection: null,

      patientTableLoading: true,

      patientListColumn: [
        {
          name: 'room',
          label: 'Room',
          field: ''
        },
        {
          name: 'patient',
          label: 'Patient',
          field: ''
        },
        {
          name: 'status',
          label: 'Status',
          field: ''
        },
        {
          name: 'admission_date',
          label: 'Admission Date',
          field: ''
        },
        {
          name: 'action',
          label: 'Action',
          field: ''
        },

      ],

      patientList: [],

      nurseCallDialog: false,
      nurseCallDialogAction: []
    };
  },

  async mounted() {

    // ==================== Functions ====================

    await this.getPatientList()

    // ===================================================

    // ==================== WebSockets ===================

    // ----------------------- PatientListConnection ------------------------

    // console.log("Starting Connection to Websocket Server")
    this.patientListConnection = new WebSocket("ws://localhost:8000/ws/patient-admission/")

    this.patientListConnection.onopen = (event => {
      // console.log("Successfully connected to the echo WebSocket Server.")

      this.patientListConnection.send(JSON.stringify({
        action: "list",
        request_id: new Date().getTime()
      }))
    })

    this.patientListConnection.onmessage = (response => {
      let patientListData = JSON.parse(response.data)
      if(patientListData.action === "list") {
        this.patientList = patientListData.data
        this.patientTableLoading = false
        this.patientListConnection.send(JSON.stringify({
          action: "list",
          request_id: new Date().getTime()
        }))
      } else if(patientListData.action === "create") {
        this.patientListConnection.send(JSON.stringify({
          action: "list",
          request_id: new Date().getTime()
        }))
      } else if(patientListData.action === "update") {
        this.patientListConnection.send(JSON.stringify({
          action: "list",
          request_id: new Date().getTime()
        }))
      } else if(patientListData.action === "delete") {
        this.patientListConnection.send(JSON.stringify({
          action: "list",
          request_id: new Date().getTime()
        }))
      }
    })

    // ----------------------------------------------------------------------

    // ----------------------- PatientDetailConnection ----------------------
    // ----------------------------------------------------------------------

    // ====================================================
  },

  methods: {

    dateMeridian: function(dt) {
      return date.formatDate(dt, 'hh:mm A')
    },

    fullDate: function(dt) {
      return date.formatDate(dt, 'MMMM DD, YYYY')
    },

    async getPatientList() {
      await api
        .get('/api/v1/patient-admission/')
        .then(response => {
          this.patientList = response.data
          this.patientTableLoading = false
        })
        .catch(error => {
          console.log(error)
        })
    },

    async nurseCall() {

      // let nurseCallData = {
      //   nurse_call: false
      // }

      // await api
      //   .get(`/api/v1/patient-admission/${this.nurseCallDialogAction.id}`)
      //   .then(response => {
      //     console.log(response.data)
      //   })
      //   .catch(error => {
      //     console.log(error)
      //   })
    },

    nurseCallDialogFn(props) {

      this.nurseCallDialog = true

      this.nurseCallDialogAction = props.row

    },

    async zoomCall(props) {
      console.log(props.row.id, 'Zoom API')
    },
  },
};
</script>
