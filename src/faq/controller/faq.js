export default class Faq {
  constructor($state, $stateParams, FaqService) {
    this.$state = $state
    this.faqService = FaqService
    this.faqService.getCategories()
      .then(response => this.categories = response)
    if ($stateParams.categoryId) {
      this.faqService.getCategory($stateParams.categoryId)
        .then(response => this.category = response)
    } else if ($stateParams.questionId) {
      this.faqService.getQuestion($stateParams.questionId)
        .then(response => this.question = response)
    } else if (!$stateParams.categoryId && !$stateParams.questionId) {
      $state.go('faq.category', { categoryId: 1 })
    }
  }
}

Faq.$inject = ['$state','$stateParams', 'FaqService']