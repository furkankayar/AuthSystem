<template>
  <CRow>
    <CCol col="12" xl="12">
      <transition name="slide">
        <CCard>
          <CCardHeader>
            Groups
          </CCardHeader>
          <CCardBody>
            <CDataTable
              hover
              striped
              :items="items"
              :fields="fields"
              :items-per-page="perPage"
              @row-clicked="rowClicked"
              :pagination="$options.paginationProps"
              index-column
              clickable-rows
            >
              <template #username="data">
                <td>
                  <strong>{{data.item.username}}</strong>
                </td>
              </template>

              <template #is_active="data">
                <td>
                  <CBadge :color="getBadge(data.item.is_active)">
                    {{data.item.is_active}}
                  </CBadge>
                </td>
              </template>
            </CDataTable>
            <CButton color="primary" v-on:click="redirect()">
              <CIcon name="cil-plus"/>&nbsp;Add New Group
            </CButton>
          </CCardBody>
        </CCard>
      </transition>
    </CCol>
  </CRow>
</template>

<script>
import api from '../../api'
export default {
  name: 'Groups',
  data: () => {
    return {
      items: [],
      fields: [
        { key: 'group_id' },
        { key: 'group_name' }
      ],
      perPage: 10,
    }
  },
  paginationProps: {
    align: 'center',
    doubleArrows: false,
    previousButtonHtml: 'prev',
    nextButtonHtml: 'next'
  },
  mounted () {
    api.read_groups({})
      .then(res => {
        if (res.data.error === false) {
          this.items = res.data.message;
        } else {
          this.items = [];
        }
      })
      .catch(err => {
        if (err) {
          this.items = [];
        }
      })
  },
  methods: {
    getBadge (is_active) {
      return is_active === true ? 'success' : 'warning'
    },
    groupLink (id) {
      return `groups/${id.toString()}`
    },
    rowClicked (item, index) {
      const groupLink = this.groupLink(item.group_id)
      this.$router.push({path: groupLink})
    },
    redirect () {
      this.$router.push({path: 'groups/new_group'})
    }
  }
}
</script>
