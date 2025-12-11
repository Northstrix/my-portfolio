
import type { ComponentType } from "react";
import RefinedChronicleButtonPreviewDemo from '@/app/the-actual-components/refined-chronicle-button/demo-preview';
import FishyButtonPreviewDemo from '@/app/the-actual-components/fishy-button/demo-preview';
import MetamorphicLoaderPreviewDemo from '@/app/the-actual-components/metamorphic-loader/demo-preview';
export interface ComponentMetadata {
  id: string;
  title: string;
  description: string;
  demo?: ComponentType;
  isPreviewImage?: boolean;
}

export const componentsMetadata: ComponentMetadata[] = [
  {
    id: "refined-chronicle-button",
    title: "refined_chronicle_button_title",
    description: "refined_chronicle_button_desc",
    demo: RefinedChronicleButtonPreviewDemo,
  },
  {
    id: "circular-testimonials",
    title: "circular_testimonials_title",
    description: "circular_testimonials_desc",
    isPreviewImage: true,
  },
  {
    id: 'slider-hero-section',
    title: 'slider_hero_title',
    description: 'slider_hero_desc',
    isPreviewImage: true,
  },
  {
    id: "project-showcase",
    title: "project_showcase_title",
    description: "project_showcase_desc",
    isPreviewImage: true,
  },
  {
    id: "inflected-card",
    title: "inflected_card_title",
    description: "inflected_card_desc",
    isPreviewImage: true,
  },
  {
    id: "splashed-push-notifications",
    title: "splashed_push_notifications_title",
    description: "splashed_push_notifications_desc",
    isPreviewImage: true,
  },
  {
    id: "fishy-button",
    title: "fishy_button_title",
    description: "fishy_button_desc",
    demo: FishyButtonPreviewDemo,
  },
  {
    id: "fishy-file-drop",
    title: "fishy_file_drop_title",
    description: "fishy_file_drop_desc",
    isPreviewImage: true,
  },
  {
    id: "shamayim-toggle-switch",
    title: "shamayim_toggle_switch_title",
    description: "shamayim_toggle_switch_desc",
    isPreviewImage: true,
  },
  {
    id: "metamorphic-loader",
    title: "metamorphic_loader_title",
    description: "metamorphic_loader_desc",
    demo: MetamorphicLoaderPreviewDemo,
  },
  {
    id: "bauble-toggle",
    title: "bauble_toggle_title",
    description: "bauble_toggle_desc",
    isPreviewImage: true,
  },
  {
    id: "login-form",
    title: "login_form_title",
    description: "login_form_desc",
    isPreviewImage: true,
  },
];