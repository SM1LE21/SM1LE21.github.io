# app/schemas/personal_data.py
# This file contains the Pydantic models for the personal data of the user.
# Pydantic is a data validation library in Python that provides data validation and parsing using Python type annotations.

from pydantic import BaseModel, AnyUrl, Field, validator
from typing import List, Optional


class Experience(BaseModel):
    date: str
    jobTitle: str
    company: str
    company_link: AnyUrl
    description: str
    skills: List[str]


class Certificate(BaseModel):
    date: str
    jobTitle: str
    title_link: AnyUrl
    company: str
    description: str


class Education(BaseModel):
    jobTitle: str
    company: str
    company_link: AnyUrl
    description: Optional[str] = None


class ProjectContent(BaseModel):
    title: Optional[str] = None
    image: Optional[str] = None
    description: Optional[str] = None
    video: Optional[str] = None


class Project(BaseModel):
    title: str
    description: str
    big_description: List[str]
    github_link: Optional[AnyUrl] = None
    link: Optional[AnyUrl] = None
    link_text: Optional[str] = None
    image: Optional[str] = None
    video: Optional[str] = None
    showMainMedia: bool
    embedWebsite: bool
    embedLink: Optional[AnyUrl] = None
    skills: List[str]
    content: List[ProjectContent]

    @validator('link', pre=True, always=True)
    def set_link(cls, v):
        if isinstance(v, str) and not v.strip():
            return None
        return v

    @validator('embedLink', pre=True, always=True)
    def set_embedLink(cls, v):
        if isinstance(v, str) and not v.strip():
            return None
        return v


class SocialLink(BaseModel):
    title: str
    url: AnyUrl
    icon: str


class PersonalData(BaseModel):
    name: str
    title: str
    description: str
    about: List[str]
    experience: List[Experience]
    certificates: List[Certificate]
    education: List[Education]
    projects: List[Project]
    socialLinks: List[SocialLink]
