import {Component} from 'react'
import Loader from 'react-loader-spinner'

import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css'

import './App.css'

const categoriesList = [
  {id: 'ALL', displayText: 'All'},
  {id: 'STATIC', displayText: 'Static'},
  {id: 'RESPONSIVE', displayText: 'Responsive'},
  {id: 'DYNAMIC', displayText: 'Dynamic'},
  {id: 'REACT', displayText: 'React'},
]

const apiStatusListConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class App extends Component {
  state = {
    newList: [],
    optionId: categoriesList[0].id,
    apiStatus: apiStatusListConstants.initial,
  }

  componentDidMount = () => {
    this.getListDetails()
  }

  getListDetails = async () => {
    const {optionId} = this.state
    this.setState({
      apiStatus: apiStatusListConstants.inProgress,
    })

    const response = await fetch(
      'https://apis.ccbp.in/ps/projects?category=${optionId}',
    )

    const data = await response.json()
    console.log(data)
    if (response.ok === true) {
      const formattedData = data.projects.map(eachItem => ({
        id: eachItem.id,
        name: eachItem.name,
        imageUrl: eachItem.image_url,
      }))

      this.setState({
        newList: formattedData,

        apiStatus: apiStatusListConstants.success,
      })
    } else {
      this.setState({
        apiStatus: apiStatusListConstants.failure,
      })
    }
  }

  onChangeOptionId = event => {
    this.setState({optionId: event.target.value})
  }

  renderList = () => {
    const {newList} = this.state

    const {name, imageUrl} = newList

    return (
      <div>
        <img src={imageUrl} alt={name} />
        <h1>{name}</h1>
      </div>
    )
  }

  onRetryProfile = () => {
    this.getListDetails()
  }

  renderListFailureView = () => (
    <div>
      <img
        src="https://assets.ccbp.in/frontend/react-js/projects-showcase/failure-img.png"
        alt="failure view"
        className="failure-view-image"
      />

      <h1>Oops! Something Went Wrong</h1>

      <p>We cannot seem to find the page you are looking for</p>

      <button type="button" className="button" onClick={this.onRetryProfile}>
        Retry
      </button>
    </div>
  )

  renderLoadingView = () => (
    <div className="products-loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  onRenderListStatus = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusListConstants.success:
        return this.renderList()

      case apiStatusListConstants.failure:
        return this.renderListFailureView()

      case apiStatusListConstants.inProgress:
        return this.renderLoadingView()

      default:
        return null
    }
  }

  render() {
    const {optionId} = this.state
    return (
      <div>
        <nav className="nav-header">
          <div className="nav-content">
            <img
              className="website-logo"
              src="https://assets.ccbp.in/frontend/react-js/projects-showcase/website-logo-img.png"
              alt="website logo"
            />
          </div>
        </nav>
        <div>
          <select
            className="capital-select"
            onChange={this.onChangeOptionId}
            value={optionId}
          >
            {categoriesList.map(eachCapital => (
              <option
                key={eachCapital.id}
                value={eachCapital.id}
                className="option"
              >
                {eachCapital.displayText}
              </option>
            ))}
          </select>
          <div>{this.onRenderListStatus()}</div>
        </div>
      </div>
    )
  }
}

export default App
