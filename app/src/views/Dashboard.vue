<template>
  <div>
    <!--<WidgetsDropdown/>
    <CCard>

    </CCard>
    <WidgetsBrand/>-->
    <CRow>
      <CCol md="4">
        <CWidgetProgressIcon
          v-bind:header= "this.userCounter.toString()"
          text="Online Users"
          color="info"
          inverse
        >
          <CIcon name="cil-people" height="36"/>
        </CWidgetProgressIcon>
      </CCol>
    </CRow>
  </div>
</template>

<script>
import MainChartExample from './charts/MainChartExample'
import WidgetsDropdown from './widgets/WidgetsDropdown'
import WidgetsBrand from './widgets/WidgetsBrand'

export default {
  name: 'Dashboard',
  components: {
    MainChartExample,
    WidgetsDropdown,
    WidgetsBrand
  }
}
</script>
