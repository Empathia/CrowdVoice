module AdminHelper

  def menu_bar_link label, path
    content_tag(:li ) do
      link_to label, path
    end
  end

  def has_infograph(voice)
    if !voice.blocks.empty?
      voice.blocks.each do |block|
        unless block.data.present?
          return "false"
        end
      end
      "true"
    else
      "false"
    end
  end

end
