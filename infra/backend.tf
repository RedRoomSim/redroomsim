terraform {
  backend "s3" {
    bucket = "redroomsimbucket"
    key    = "terraform/state.tfstate"
    region = "us-east-2"
  }
}
