import React from "react";
// axios
import Axios from "axios";
//REACT-REDUX 
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { bindActionCreators } from "redux";

//CAROUSEL
import Carousel from "../../CarouselCard";

//SEMANTIC-UI-REACT
import { Item, Segment, Container, Grid, Rating, Label, Button } from "semantic-ui-react";

//NAVBAR
import Navbar from "./Navbar";

// IMAGE
import cardImg from "../../images/food1.jpg";

//CSS
import "../../css/master.css";

//ACTION-CREATOR
import { fillDashboard } from "../../actions/index";

class Dashboard extends React.Component {
  //only run for the first time 
  componentDidMount(){
    Axios.get('/api')
        .then((response)=>{
          const data=response.data;
          this.props.fillDashboard(data);
          console.log("data has been delivered to client side");
        })
        .catch((error)=>{
          //not a good approach . did this just for fun
          console.log("bhag bdk",error);
        })
  }
  //! Adding data to recieved section of CURRENT USER 
  addDataToRecieved(cardData){
    
    console.log("availing data: ",cardData);
    Axios({
      url: "/api/recieve",
      method: "POST",
      //?  we can assign a key of object(key:val) to another object
      data:{
        cardData:cardData,
        recieverId:this.props.authDetails.user.id
      }
    })
    .then(()=>{
      console.log("recieved data sent to server!!");
    })
    .catch((err)=>{
      console.log("recieved data didnt send",err);
    })
  }
  render() {
    console.log("in dashboard",this.props.cardDetails);
    const cardList = this.props.cardDetails.map((cardDetail) => {
      return (
        <Grid.Column>
          <Segment className="details">
            <Item.Group divided>
              <Item >
                <Item.Image size="small" src={cardImg} />

                <Item.Content>
                  <Item.Header>{cardDetail.title}
                    <Label color={(cardDetail.type === "veg") ? "green" : "red"} attached="top right">{cardDetail.type}
                    </Label>
                  </Item.Header>
                  <Item.Description>
                    <Label.Group>
                      <Label className="labelcolor">{cardDetail.quantity}KG</Label>
                      <Label>{cardDetail.category}</Label>
                      <Label>{cardDetail.state}</Label>
                    </Label.Group>
                  </Item.Description>

                  {/* <Item.Meta>{cardDetail.date}</Item.Meta> */}
                  {/* <Item.Meta>{cardDetail.quantity}</Item.Meta> */}
                  <Item.Description>

                    <p>
                      {cardDetail.other}
                    </p>
                  </Item.Description>
                  <Item.Extra>
                    <Link className={cardDetail.expired ? "mini ui red button" : "mini ui green button"} to={cardDetail.expired ? "/dashboard" : "/foodinfo"}>{cardDetail.expired ? 'Expired' : 'Available'}</Link>
                    <Button 
                      className="mini ui purple button"
                      //? we cannt use {this.addDataToRecieved(cardDetaiils)} directly here.
                      //! LINK : https://stackoverflow.com/questions/29810914/react-js-onclick-cant-pass-value-to-method
                      onClick={()=>{this.addDataToRecieved(cardDetail)}}
                    >Avail</Button>
                    <Rating className="rating-star" icon='star' defaultRating={3} maxRating={5} />
                  </Item.Extra>
                </Item.Content>
              </Item>
            </Item.Group>
          </Segment>
        </Grid.Column>
      );
    });

    return (
      <div >
        <div> <Navbar/> </div>
        <Container className="dashboard ">
          {/* <Segment> */}
          <Carousel />
          {/* </Segment> */}
          <Grid columns={2}>
            <Grid.Row className="ui stackable doubling">
              {cardList}
            </Grid.Row>

          </Grid>

        </Container>
      </div>

    );
  }
}
// Passing data to our state
const mapDispatchToProps = (dispatch)=>{
  return bindActionCreators({fillDashboard},dispatch);
}
//GETTING DATA FROM REACT
const mapStateToProp = (state) => {
  return {
    cardDetails: state.cardDetails,
    authDetails:state.authDetails
    // carouselFact: state.carouselFact
  };
};

export default connect(mapStateToProp,mapDispatchToProps)(Dashboard);
