require 'wordnet'

class Hyponyms
  def self.list_for(sentence)

    lex = WordNet::Lexicon.new
    # Use for all the categories
    # {:verb=>"v", :noun=>"n", :adjective=>"a", :adverb=>"r", :other=>"s"}
    syntactic_categories = WordNet::SYNTACTIC_CATEGORIES

    rs = sentence.split(' ').map do |txt|
         ['n', 's'].map do |wd|
              rs = lex.lookup_synsets(txt.downcase, wd);
              rs.first.words if rs
         end
    end.flatten.compact.uniq

    lex.close
    rs
  end
end
