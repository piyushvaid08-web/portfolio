import os
import re

directory = r'd:\portfolio'

def fix_line(line):
    # Keep metadata and structural instances
    if '<title>' in line or '<meta' in line or 'application/ld+json' in line or 'brand-mark' in line or 'loading-orb' in line or '<footer' in line or 'site-footer' in line or 'favicon' in line or 'mailto:' in line:
        # we will still do some replacements but maybe keep it more intact, or skip entirely?
        # Actually, user said "hide the keywords... keep keywords very limited". 
        # So it's okay to skip the `<head>` meta tags and the logo.
        return line

    # Case insensitive replacements but keeping case for the replacement string where appropriate
    # Verbs
    line = re.sub(r'(?i)Piyush Vaid is', 'I am', line)
    line = re.sub(r'(?i)Piyush Vaid has', 'I have', line)
    line = re.sub(r'(?i)Piyush Vaid helps', 'I help', line)
    line = re.sub(r'(?i)Piyush Vaid does', 'I do', line)
    line = re.sub(r'(?i)Piyush Vaid completed', 'I completed', line)
    line = re.sub(r'(?i)Piyush Vaid picked up', 'I picked up', line)
    line = re.sub(r'(?i)Piyush Vaid creates', 'I create', line)
    line = re.sub(r'(?i)Piyush Vaid brings', 'I bring', line)
    line = re.sub(r'(?i)Piyush Vaid develops', 'I develop', line)
    line = re.sub(r'(?i)Piyush Vaid crafts', 'I craft', line)
    line = re.sub(r'(?i)Piyush Vaid builds', 'I build', line)
    line = re.sub(r'(?i)Piyush Vaid founded', 'I founded', line)
    line = re.sub(r'(?i)Piyush Vaid handles', 'I handle', line)
    line = re.sub(r'(?i)Piyush Vaid approaches', 'I approach', line)
    line = re.sub(r'(?i)Piyush Vaid believes', 'I believe', line)
    line = re.sub(r'(?i)Piyush Vaid uses', 'I use', line)
    line = re.sub(r'(?i)Piyush Vaid learned', 'I learned', line)
    line = re.sub(r'(?i)Piyush Vaid was', 'I was', line)
    line = re.sub(r'(?i)Piyush Vaid saw', 'I saw', line)
    line = re.sub(r'(?i)Piyush Vaid would', 'I would', line)
    line = re.sub(r'(?i)Piyush Vaid stays', 'I stay', line)
    line = re.sub(r'(?i)Piyush Vaid writes', 'I write', line)
    line = re.sub(r'(?i)Piyush Vaid argues', 'I argue', line)
    line = re.sub(r'(?i)Piyush Vaid delivers', 'I deliver', line)
    line = re.sub(r'(?i)Piyush Vaid works', 'I work', line)
    line = re.sub(r'(?i)Piyush Vaid offers', 'I offer', line)
    line = re.sub(r'(?i)Piyush Vaid ensures', 'I ensure', line)
    line = re.sub(r'(?i)Piyush Vaid combines', 'I combine', line)
    line = re.sub(r'(?i)Piyush Vaid focuses', 'I focus', line)
    
    # Possessive / specific phrases
    line = re.sub(r"(?i)Piyush Vaid's", 'my', line)
    line = re.sub(r"(?i)Piyush Vaid’s", 'my', line)
    line = re.sub(r'(?i)The journey of Piyush Vaid', 'My journey', line)
    line = re.sub(r'(?i)story of Piyush Vaid', 'my story', line)
    line = re.sub(r'(?i)story behind Piyush Vaid', 'my story', line)
    line = re.sub(r'(?i)work of Piyush Vaid', 'my work', line)
    line = re.sub(r'(?i)approach of Piyush Vaid', 'my approach', line)
    line = re.sub(r'(?i)philosophy that drives Piyush Vaid', 'philosophy that drives me', line)
    line = re.sub(r'(?i)portfolio of Piyush Vaid', 'my portfolio', line)
    line = re.sub(r'(?i)clients of Piyush Vaid', 'my clients', line)
    line = re.sub(r'(?i)services from Piyush Vaid', 'my services', line)
    
    # Object/Prepositional
    line = re.sub(r'(?i)with Piyush Vaid', 'with me', line)
    line = re.sub(r'(?i)by Piyush Vaid', 'by me', line)
    line = re.sub(r'(?i)for Piyush Vaid', 'for me', line)
    line = re.sub(r'(?i)about Piyush Vaid', 'about me', line)
    line = re.sub(r'(?i)to Piyush Vaid', 'to me', line)
    line = re.sub(r'(?i)tell Piyush Vaid', 'tell me', line)
    line = re.sub(r'(?i)contact Piyush Vaid', 'contact me', line)
    
    # "Piyush Vaid" in headings
    line = re.sub(r'>Piyush Vaid<', '>Me<', line)
    line = re.sub(r'>Who is Piyush Vaid\?<', '>Who am I?<', line)

    # Any leftover "Piyush Vaid" that hasn't been replaced...
    # We can replace them with "I" if it's the subject. It's usually the subject.
    # Let's replace the leftover "Piyush Vaid" with "I". If it causes grammatical issues like "The I", we might need to be careful, but we caught most "of Piyush Vaid" above.
    line = re.sub(r'(?i)Piyush Vaid', 'I', line)
    
    return line

for filename in os.listdir(directory):
    if filename.endswith(".html"):
        filepath = os.path.join(directory, filename)
        with open(filepath, 'r', encoding='utf-8') as f:
            lines = f.readlines()
            
        new_lines = [fix_line(line) for line in lines]
        
        with open(filepath, 'w', encoding='utf-8') as f:
            f.writelines(new_lines)
            
print("Done processing HTML files.")
