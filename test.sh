# run from the repo root on a throwaway branch or before first push
START="2024-11-01 09:00:00"   # earliest possible time
SPREAD_DAYS=120               # how far to spread commits
COMMITS=25                    # how many to create

for i in $(seq $COMMITS); do
  # random offset within range
  d=$((RANDOM % SPREAD_DAYS))
  h=$((RANDOM % 10))   # business-ish hours
  m=$((RANDOM % 60))
  s=$((RANDOM % 60))
  TS=$(date -u -d "$START + $d days + $h hours + $m minutes + $s seconds" '+%Y-%m-%dT%H:%M:%SZ')

  export GIT_AUTHOR_DATE="$TS"
  export GIT_COMMITTER_DATE="$TS"

  # touch something small so the commit is real
  echo "- tick $i at $TS" >> .history.md
  git add .history.md
  git commit -m "chore: maintenance tick $i"
done

# push once you are happy
git push origin main

