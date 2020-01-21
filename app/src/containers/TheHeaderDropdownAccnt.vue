<template>
  <CDropdown
    inNav
    class="c-header-nav-items"
    placement="bottom-end"
    add-menu-classes="pt-0"
  >
    <template #toggler>
      <CHeaderNavLink>
        <div class="c-avatar">
          <img
            src="img/avatars/149071.png"
            class="c-avatar-img "
          />
        </div>
      </CHeaderNavLink>
    </template>
    <CDropdownHeader
      tag="div"
      class="text-center text-dark"
      color="light"
    >
    <strong><CIcon name="cil-user" /> {{ this.activeUser.username }}</strong>
    </CDropdownHeader>
    <CDropdownItem v-on:click="settings()">
      <CIcon name="cil-settings" /> Settings
    </CDropdownItem>
    <CDropdownDivider/>
    <CDropdownItem v-on:click="logout()">
      <CIcon name="cil-lock-locked" /> Logout
    </CDropdownItem>
  </CDropdown>
</template>

<script>
import VueCookie from 'vue-cookie'

export default {
  name: 'TheHeaderDropdownAccnt',
  data () {
    return {
      itemsCount: 42
    }
  },
  methods: {
    logout () {
      VueCookie.delete('access_token')
      this.$router.push('/pages/login')
    },
    settings () {
      if (this.$route.path !== '/settings'){
        this.$router.push('/settings')
      }
    }
  }
}
</script>

<style scoped>
  .c-icon {
    margin-right: 0.3rem;
  }
</style>
