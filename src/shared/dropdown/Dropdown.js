import BaseComponent from 'shared/BaseComponent';

export default class Dropdown extends BaseComponent {
  // *********************************************************
  // Constructor
  // *********************************************************
  constructor (...args) {
    super(...args);
    this.state = {
      open: false
    };
    this.handleDocumentClick = this.handleDocumentClick.bind(this);
    this.toggleOpen = this.toggleOpen.bind(this);
  }

  componentDidMount () {
    document.addEventListener('click', this.handleDocumentClick);
  }

  componentWillUnmount () {
    super.componentWillUnmount();
    document.removeEventListener('click', this.handleDocumentClick);
  }

  toggleOpen () {
    this.setState({
      open: !this.state.open
    });
  }

  handleDocumentClick (event) {
    if (this.container) {
      if (this.state.open && !this.container.contains(event.target)) {
        this.setState({
          open: false
        });
      }
    }
  }
}
