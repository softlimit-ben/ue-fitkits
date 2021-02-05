import { Button, Card, Form, FormLayout, Layout, Page, Stack, TextField, } from '@shopify/polaris';

class Index extends React.Component {
  state = {
    fitkitId: '',
    saved: ''
  }
  componentDidMount() {
    // get existing Fitkit ID from DB
    fetch(`/api/fitkit/${this.props.shop}`)
        .then(response => response.json())
        .then(data => {
          this.setState({ fitkitId: data});
        });
  }
  render() {
    return (
      <Page>
        <Layout>
          <Layout.AnnotatedSection
            title="FitKit ID"
            description="Add FitKit VARIANT ID"
          >
            <Card sectioned>
              <Form onSubmit={this.handleSubmit}>
                <FormLayout>
                  <TextField
                    placeholder={this.state.fitkitId}
                    value={this.state.fitkitId}
                    onChange={this.handleChange.bind(this)}
                    label="FitKit Variant ID"
                    type="text"
                  />
                  <p>{this.state.saved}</p>
                  <Stack distribution="trailing">
                    <Button primary submit>
                      Save
                    </Button>
                  </Stack>
                </FormLayout>
              </Form>
            </Card>
          </Layout.AnnotatedSection>
        </Layout>
      </Page>
    );
  }

  handleSubmit = () => {
    this.setState({
      fitkitId: this.state.fitkitId
    });
    const data = {id: this.state.fitkitId, shop: this.props.shop};
    // console.log('submission',data);
    fetch(`/api/fitkit/${this.props.shop}/${data.id}`,{
      headers: {
      'Content-Type': 'application/json'
      }
    })
    .then( res => res.json())
    .then( data => {
      this.setState({
        saved: 'Saved'
      });
      let _this = this;
      //remove saved note after 3 seconds
      setTimeout(function(){ _this.setState({ saved: '' })}, 3000);
    } );

  };

  handleChange = (e) => {
    this.setState({fitkitId: e});
  }
}

export default Index;
