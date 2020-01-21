<template>
  <CContainer class="d-flex align-items-center min-vh-100">
    <CRow class="w-100 justify-content-center">
      <CCol md="6">
        <div class="w-100 text-center">
          <div class="clearfix">
            <h1 class="display-3 mr-4">404</h1>
            <h4 class="pt-3">Oops! You're lost.</h4>
            <p class="text-muted">The page you are looking for was not found.</p>
          </div>
          <div class="text-center">
            <CButton class="text-center" @click="redirect" color="primary">Go to Homepage</CButton>
          </div>
        </div>
      </CCol>
    </CRow>
  </CContainer>
</template>

<script>
export default {
  name: 'Page404',
  methods: {
    redirect: () => {
      window.location.href = '/'
    }
  }
}
</script>
