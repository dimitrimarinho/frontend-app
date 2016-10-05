export default class EventDonateCard {
  constructor($uibModalInstance, donate, EventService, StorageService) {
    this.instance = $uibModalInstance
    this.eventService = EventService
    this.donate = donate
    this.donate.data['is_anonymous'] = false
    this.logged = StorageService.getItem('token')
  }
  buildCard() {
    this.donate.data['message'] = this.donate.message
    delete this.donate.message
    let method = (this.logged) ? 'payLogged' : 'payPublic'
    console.log(method)
    this.eventService[method](this.donate.uuid, this.donate.data)
      .then(
        response => this.instance.close(response.data),
        error => this.instance.close(error.data)
      )
  }
  cancel() {
    this.instance.dismiss('cancel')
  }
}

EventDonateCard.$inject = ['$uibModalInstance', 'donate', 'EventService', 'StorageService']