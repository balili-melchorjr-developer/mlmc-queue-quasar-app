<template>
  <div class="q-pa-md">
    <div class="text-h6 text-weight-light">Nurse Desk</div>

  </div>
</template>
<script>
import { api } from "boot/axios";
import { Notify } from "quasar";

export default {
  name: "NurseDesk",
  data() {
    return {

      posts: [],

      connection: null
    };
  },

  async mounted() {

    await this.getPost()

    // console.log("Starting Connection to Websocket Server")
    this.connection = new WebSocket("ws://localhost:8000/ws/posts/")

    this.connection.onopen = (event => {
      // console.log("Successfully connected to the echo WebSocket Server.")

      this.connection.send(JSON.stringify({
        action: "list",
        request_id: new Date().getTime()
      }))
    })

    this.connection.onmessage = (response => {
      let postData = JSON.parse(response.data)
      if(postData.action === "list") {

        this.posts = postData.data
        this.connection.send(JSON.stringify({
          action: "list",
          request_id: new Date().getTime()
        }))
      } else if(postData.action === "create") {
        // this.posts = JSON.parse(response.data).data
        this.connection.send(JSON.stringify({
          action: "list",
          request_id: new Date().getTime()
        }))
      } else if(postData.action === "update") {
        this.connection.send(JSON.stringify({
          action: "list",
          request_id: new Date().getTime()
        }))
      } else if(postData.action === "delete") {
        this.connection.send(JSON.stringify({
          action: "list",
          request_id: new Date().getTime()
        }))
      }
    })
  },

  methods: {
    async getPost() {
      await api
        .get("/api/v1/post/")
        .then(response => {
          this.posts = response.data
        })
        .catch(error => {
          console.log(error)
        })
    },

    async updatePost(props) {

      let updateData = {
        title: props.row.title,
        content: props.row.content,
        status: 'Draft',
        author: props.row.author
      }

      await api
        .put(`/api/v1/post/${props.row.id}/`, updateData)
        .then(response => {
          console.log(updateData)
        })
        .catch(error => {
          console.log(error)
        })
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
    }

  },
};
</script>
