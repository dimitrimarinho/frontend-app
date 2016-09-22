export default class ProfileRegister {
  constructor($scope, $stateParams, $state, $filter, $timeout, ActivityAreaService, ProfileService) {
    this.activityAreaService = ActivityAreaService
    this.service = ProfileService
    this.timeout = $timeout
    this.state = $state
    this.filter = $filter
    this.masterProfile = {
      gender: 'Feminino',
    }
    if ($stateParams.tab === 'ong') this.activeForm = 1
    this.step = 0
    this.showPassword = false
    this.typeInputPassword = 'password'
    this.getActivityAreas()
    // $http.get('data/area_activities.json')
    //   .then(response => this.area_activities = response.data) 
  }
  getActivityAreas() {
    this.activityAreaService.findAll()
      .then(response => this.area_activities = response.data.values)
  }
  resetProfile() {
    this.profile = angular.copy(this.masterProfile)
  }
  toggleShowPassword() {
    this.typeInputPassword = this.showPassword ? 'text' : 'password'
  }
  changeTab(active) {
    this.error = null
    this.resetProfile()
    this.changeStep()
    switch (active) {
      case 0: this.timeout(() => document.querySelector('form[name="registerOng"] input[name="name_organization"]').focus(), 300); break;
      case 1: this.timeout(() => document.querySelector('form[name="registerUser"] input[name="name"]').focus(), 300); break;
    }
  }
  validateStep(form) {
    let validated
    switch (this.step) {
      case 0: validated = (form.name_organization.$invalid || form.mission.$invalid || form.area_activity_uuid.$invalid) ? true : false; break;
      case 1: validated = (form.phone.$invalid || form.facebook.$invalid) ? true : false; break;
      case 2: validated = (form.name.$invalid || form.email.$invalid || form.password.$invalid) ? true : false; break;
    }
    return validated
  }
  changeStep(direction) {
    switch (direction) {
      case 'next': this.step++; break;
      case 'prev': this.step--; break;
      default: this.step = 0
    }
    switch (this.step) {
      case 0: this.timeout(() => document.querySelector('form[name="registerOng"] input[name="name_organization"]').focus(), 300); break;
      case 1: this.timeout(() => document.querySelector('form[name="registerOng"] input[name="phone"]').focus(), 300); break;
      case 2: this.timeout(() => document.querySelector('form[name="registerOng"] input[name="name"]').focus(), 300); break;
    }
  }
  registerFacebook() {
    this.service.registerFacebook(response => {
      this.registerUser(response)
    })
  }
  checkOfAge(age) {
    let date = new Date(),
      timeDiff = date - age,
      diffDays = timeDiff / (1000 * 3600 * 24 * 365)
    return (diffDays < 18) ? false : true

  }
  registerUser(profile) {
    this.error = null
    profile = (profile) ? angular.copy(profile) : angular.copy(this.profile)
    let birthdate
    if (profile.facebook_token) {
      profile.gender = (profile.gender == 'male') ? 'Masculino' : 'Feminino'
      birthdate = profile.birthday.split('/')
      profile.birthdate = new Date(`${birthdate[2]}-${birthdate[0]}-${birthdate[1]}`)
    } else {
      birthdate = profile.birthdate.split('/')
      profile.birthdate = new Date(`${birthdate[2]}-${birthdate[1]}-${birthdate[0]}`)
    }
    if (!this.checkOfAge(profile.birthdate)) {
      this.error = {
        errors: {
          birthdate: ['Desculpe, não podemos aceitar usuários menores de idade.']
        }
      }
    } else {
      profile.birthdate = this.filter('date')(profile.birthdate.setDate(profile.birthdate.getDate() + 1), 'yyyy-MM-dd')
      this.service.register(profile)
        .then(
        response => this.registerSuccess(response),
        response => this.registerError(response)
        )
    }
  }
  registerOng(profile) {
    this.error = null
    profile = angular.copy(profile)
    if (profile.area_activity_uuid) {
      profile.area_activity_uuid = profile.area_activity_uuid.uuid
    }
    profile = (profile) ? angular.copy(profile) : angular.copy(this.profile)
    profile.phone = profile.phone.replace(/\s/g, '');
    this.service.register(profile)
      .then(
      response => this.registerSuccess(response),
      response => this.registerError(response)
      )
  }
  registerSuccess(response) {
    console.log(response)
  }
  registerError(response) {
    this.error = response.data
    console.error(JSON.stringify(response.data))
  }
}

ProfileRegister.$inject = ['$scope', '$stateParams', '$state', '$filter', '$timeout', 'ActivityAreaService', 'ProfileService']