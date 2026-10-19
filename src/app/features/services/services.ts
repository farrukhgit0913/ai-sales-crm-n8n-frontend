
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

interface ServiceItem {
  id: number;
  name: string;
  category: string;
  description: string;
  price: number;
  billing: string;
  icon: string;
  features: string[];
  popular?: boolean;
}

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './services.html',
  styleUrl: './services.scss'
})
export class ServicesComponent {
  searchTerm = '';
  selectedCategory = 'All';
  selectedService: ServiceItem | null = null;

  categories = [
    'All',
    'CRM',
    'AI & Automation',
    'Integrations',
    'Consulting'
  ];

  services: ServiceItem[] = [
    {
      id: 1,
      name: 'AI Lead Qualification',
      category: 'AI & Automation',
      description:
        'Automatically analyze, score, and prioritize incoming leads using AI.',
      price: 49,
      billing: '/month',
      icon: '✦',
      features: [
        'AI-powered lead scoring',
        'Automated qualification',
        'Lead summaries',
        'Priority recommendations'
      ],
      popular: true
    },
    {
      id: 2,
      name: 'CRM Setup & Management',
      category: 'CRM',
      description:
        'Centralize customer records, sales pipelines, and team activities.',
      price: 99,
      billing: '/month',
      icon: '▣',
      features: [
        'Centralized customer profiles',
        'Sales pipeline management',
        'Lead assignment',
        'Activity tracking'
      ]
    },
    {
      id: 3,
      name: 'Automated Email Follow-ups',
      category: 'AI & Automation',
      description:
        'Create personalized follow-up emails and automate sales communication.',
      price: 39,
      billing: '/month',
      icon: '✉',
      features: [
        'AI email generation',
        'Follow-up workflows',
        'Email templates',
        'Engagement tracking'
      ]
    },
    {
      id: 4,
      name: 'Workflow Automation',
      category: 'AI & Automation',
      description:
        'Automate repetitive sales tasks and connect workflows using n8n.',
      price: 79,
      billing: '/month',
      icon: '⟳',
      features: [
        'Custom n8n workflows',
        'Automated lead updates',
        'Event-based triggers',
        'Workflow monitoring'
      ]
    },
    {
      id: 5,
      name: 'Shopify Integration',
      category: 'Integrations',
      description:
        'Connect Shopify customers and orders with your CRM for centralized tracking.',
      price: 59,
      billing: '/month',
      icon: '⇄',
      features: [
        'Customer synchronization',
        'Order synchronization',
        'Lead creation',
        'Order activity tracking'
      ]
    },
    {
      id: 6,
      name: 'Sales Performance Analytics',
      category: 'CRM',
      description:
        'Understand lead conversion, team performance, and sales pipeline trends.',
      price: 69,
      billing: '/month',
      icon: '▥',
      features: [
        'Conversion reports',
        'Lead source analysis',
        'Sales activity reports',
        'Performance insights'
      ]
    },
    {
      id: 7,
      name: 'AI CRM Consultation',
      category: 'Consulting',
      description:
        'Get expert guidance on CRM architecture, AI features, and sales workflows.',
      price: 150,
      billing: '/session',
      icon: '◎',
      features: [
        'Requirements assessment',
        'Solution recommendations',
        'Integration planning',
        'Implementation roadmap'
      ]
    },
    {
      id: 8,
      name: 'Email & Notification Integration',
      category: 'Integrations',
      description:
        'Connect your CRM with email services and automated notifications.',
      price: 45,
      billing: '/month',
      icon: '↗',
      features: [
        'Email service integration',
        'Lead notifications',
        'Configurable alerts',
        'Delivery status tracking'
      ]
    }
  ];

  get filteredServices(): ServiceItem[] {
    const term = this.searchTerm.trim().toLowerCase();

    return this.services.filter(service => {
      const matchesCategory =
        this.selectedCategory === 'All' ||
        service.category === this.selectedCategory;

      const searchableText = [
        service.name,
        service.category,
        service.description,
        ...service.features
      ].join(' ').toLowerCase();

      return matchesCategory && searchableText.includes(term);
    });
  }

  selectCategory(category: string): void {
    this.selectedCategory = category;
  }

  viewService(service: ServiceItem): void {
    this.selectedService = service;
  }

  closeServiceDetails(): void {
    this.selectedService = null;
  }

  requestService(service: ServiceItem): void {
    // Replace this with your actual service-request API.
    alert(`Service request selected: ${service.name}`);
    this.closeServiceDetails();
  }

  trackByServiceId(
    index: number,
    service: ServiceItem
  ): number {
    return service.id;
  }
}
