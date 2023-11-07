packer {
  required_plugins {
    amazon = {
      source  = "github.com/hashicorp/amazon"
      version = ">= 1.0.0"
    }
  }
}

variable "aws_region" {
  type    = string
  default = "us-east-1"
}

variable "source_ami" {
  type    = string
  default = "ami-06db4d78cb1d3bbf9" # Debian  
}

variable "ssh_username" {
  type    = string
  default = "admin"
}

variable "ami_name_prefix" {
  type    = string
  default = "csye6225"
}

variable "instance_type" {
  type    = string
  default = "t2.micro"
}

variable "custom_ami_description" {
  type    = string
  default = "Custom AMI for CSYE 6225"
}

variable "ami_accessible_regions" {
  type    = list(string)
  default = ["us-east-1"]
}

variable "ami_accessible_users" {
  type    = list(string)
  default = ["390105516587", "048434227312"] ## add users
}


variable "device_name" {
  type    = string
  default = "/dev/xvda"
}

variable "volume_size" {
  type    = number
  default = 25
}

variable "volume_type" {
  type    = string
  default = "gp2"
}


variable "profile" {
  type    = string
  default = "dev"
}

variable "file_source" {
  type    = string
  default = "webapp.zip"
}

variable "file_destination" {
  type    = string
  default = "~/webapp.zip"
}

variable "shell_script_location" {
  type    = string
  default = "scripts.sh" #check this
}

variable "default_vpc_id" {
  type    = string
  default = "vpc-0fa75af397a6e47e0"
}


source "amazon-ebs" "my-ami" {
  region          = "${var.aws_region}"
  profile         = "${var.profile}"
  ami_name        = "${var.ami_name_prefix}_${formatdate("YYYY_MM_DD_hh_mm_ss", timestamp())}"
  ami_description = "${var.custom_ami_description}"
  ami_regions     = "${var.ami_accessible_regions}"
  ami_users       = "${var.ami_accessible_users}"
  instance_type   = "${var.instance_type}"
  source_ami      = "${var.source_ami}"
  ssh_username    = "${var.ssh_username}"
  vpc_id          = "${var.default_vpc_id}"

  aws_polling {
    delay_seconds = 120
    max_attempts  = 50
  }

  launch_block_device_mappings {
    delete_on_termination = true
    device_name           = "${var.device_name}"
    volume_size           = "${var.volume_size}"
    volume_type           = "${var.volume_type}"
  }
}

build {
  sources = ["source.amazon-ebs.my-ami"]

  provisioner "file" {
    source      = "${var.file_source}"
    destination = "${var.file_destination}"
  }

  provisioner "shell" {
    scripts      = ["${var.shell_script_location}"]
    pause_before = "10s"
    timeout      = "10s"
  }


}
