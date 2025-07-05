terraform {
  backend "s3" {
    bucket = "redroomsim-infra-state"
    key    = "terraform/state.tfstate"
    region = "us-east-1"
  }
}
