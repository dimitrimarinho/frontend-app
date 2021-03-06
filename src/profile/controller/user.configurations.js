export default class UserConfigurations {
  constructor($filter, $rootScope, $location, $anchorScroll, $stateParams, StorageService, ProfileService, ValidationFactory, TourFactory, profile) {
    this.filter = $filter
    this.rootScope = $rootScope
    this.location = $location
    this.anchorScroll = $anchorScroll
    this.stateParams = $stateParams
    this.storage = StorageService
    this.service = ProfileService
    this.validation = ValidationFactory
    this.tour = TourFactory
    this.load(profile.data)
  }
  initTour() {
    this.tour.init('userConfigTour')
    this.tour.start()
  }
  load(profile) {
    profile = angular.copy(profile)
    if (this.stateParams.novo && profile.needpassword) {
      this.initTour()
    }
    delete profile.phone
    delete profile.avatar
    profile.birthdate = new Date(profile.birthdate)
    profile.birthdate = this.filter('date')(profile.birthdate.setDate(profile.birthdate.getDate() + 1), 'dd/MM/yyyy')
    // profile.needpassword = true
    this.profile = profile
  }
  validateDate(field, date) {
    if (!field.$error.mask && date) {
      date = date.split('/')
      date = new Date(`${date[2]}-${date[1]}-${date[0]}`)
      let valid = this.validation.dateMinByYears(date, 18)
      field.$setValidity('birthdate', valid)
    } else {
      field.$setValidity('birthdate', false)
    }
  }
  save(profile) {
    this.service.change(profile, progress => {
      this.progress = progress
    }).then(
      response => {
        let newProfile = response.data
        let profile = this.storage.getItem('profile')
        newProfile = angular.extend(profile, newProfile)
        this.service.setProfile(newProfile)
        // this.storage.setItem('token', response.data.token)
        // let {name, email, type, avatar, permissions} = response.data
        // this.storage.setItem('profile', {name: name, email: email, type: type, avatar: avatar, permissions: permissions})
        // this.rootScope.$broadcast('profile.change')
        this.profile = response.data
        this.load(this.profile)
        this.rootScope.$broadcast('alert', {type: 'alert-success', icon: 'fa-check', message: { message: 'Dados alterados com sucesso!' }})
        this.location.hash('body')
        this.anchorScroll()
      },
      error => {
        this.profile.password = ''
        this.profile.new_password = ''
        this.rootScope.$broadcast('alert', {type: 'alert-warning', icon: 'fa-exclamation', message: error.data})
        this.location.hash('body')
        this.anchorScroll()
      }
    )
  }
}

UserConfigurations.$inject = ['$filter', '$rootScope', '$location', '$anchorScroll', '$stateParams', 'StorageService', 'ProfileService', 'ValidationFactory', 'TourFactory', 'profile']