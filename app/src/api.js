//  import Vue from 'vue'
import VueCookie from 'vue-cookie'
import axios from 'axios'
import qs from 'qs'

axios.defaults.baseURL = 'http://localhost:8000'

export default {
  async execute (method, resource, body) {
    return axios({
      method: method,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Bearer ${VueCookie.get('access_token')}`
      },
      url: resource,
      data: qs.stringify(body)
    })
  },
  login (data) {
    data.grant_type = 'password'
    data.client_id = 'null'
    data.client_secret = 'null'
    return this.execute('post', '/auth/login', data)
  },
  register (data) {
    return this.execute('post', '/auth/register', data)
  },
  check_username (data) {
    return this.execute('post', '/auth/check_username', data)
  },
  check_email (data) {
    return this.execute('post', '/auth/check_email', data)
  },
  is_token_valid (data) {
    return this.execute('post', '/auth/is_token_valid', null)
  },
  get_account (data) {
    return this.execute('post', '/auth/get_account', null)
  },
  reset_password (data) {
    return this.execute('post', '/auth/forgot_password', data)
  },
  check_reset_token (data) {
    return this.execute('post', '/auth/is_reset_token_valid', data)
  },
  set_new_password (data) {
    return this.execute('post', '/auth/set_new_password', data)
  },
  update_personal_info (data) {
    return this.execute('post', '/auth/update_personal_info', data)
  },
  read_account_log (data) {
    return this.execute('post', '/auth/read_account_log', data)
  },
  read_group_log (data) {
    return this.execute('post', '/auth/read_group_log', data)
  },
  read_group_permission_log (data) {
    return this.execute('post', '/auth/read_group_permission_log', data)
  },
  read_permission_log (data) {
    return this.execute('post', '/auth/read_permission_log', data)
  },
  read_reset_token_log (data) {
    return this.execute('post', '/auth/read_reset_token_log', data)
  },
  read_session_log (data) {
    return this.execute('post', '/auth/read_session_log', data)
  },
  read_user_log (data) {
    return this.execute('post', '/auth/read_user_log', data)
  },
  read_user_permission_log (data) {
    return this.execute('post', '/auth/read_user_permission_log', data)
  },
  read_users (data) {
    return this.execute('post', '/auth/read_users', data)
  },
  read_user (data) {
    return this.execute('post', '/auth/read_user', data)
  },
  update_user (data) {
    return this.execute('post', '/auth/update_user', data)
  },
  update_user_group (data) {
    return this.execute('post', '/auth/update_user_group', data)
  },
  create_group (data) {
    return this.execute('post', '/auth/create_group', data)
  },
  read_groups (data) {
    return this.execute('post', '/auth/read_groups', data)
  },
  delete_group (data) {
    return this.execute('post', '/auth/delete_group', data)
  },
  read_group_permissions (data) {
    return this.execute('post', '/auth/read_group_permissions', data)
  },
  update_group_permissions (data) {
    return this.execute('post', '/auth/update_group_permissions', data)
  },
  read_permissions (data) {
    return this.execute('post', '/auth/read_permissions', data)
  },
  read_user_permissions (data) {
    return this.execute('post', '/auth/read_user_permissions', data)
  }
}
